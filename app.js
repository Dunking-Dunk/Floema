import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import path from 'path'
import errorHandler from 'errorhandler'
import methodOverride from 'method-override'
import logger from 'morgan'
import bodyParser from 'body-parser'

import * as prismic from '@prismicio/client'
import * as prismicH from '@prismicio/helpers'
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'

const app = express()
const port = 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const endpoint = prismic.getEndpoint(process.env.PRISMIC_REPO_NAME)
const accessToken = process.env.PRISMIC_ACCESS_TOKEN
const client = prismic.createClient(endpoint, {
    fetch,
    accessToken,
})

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

const handleLinkResolver = (doc) => {
    if (doc.type === 'product') {
        return `/detail/${doc.slug}`
    }
    if (doc.type === 'about') {
        return '/about'
    }
    if (doc.type === 'collections') {
        return '/collections'
    }
    if (doc === 'collections') {
        return '/collections'
    }
    return '/'
}

app.use((req, res, next) => {
    res.locals.Link = handleLinkResolver
    res.locals.ctx = {
        prismicH,
    }
    res.locals.Numbers = (index) => {
        return index == 0 ? 'One' : index == 1 ? 'Two' : index == 2 ? 'Three' : index == 3 && 'Four'
    }
    next()
})

app.get('*', async (req, res, next) => {
    const assets = []
    const menuContent = await client.getSingle('meta')
    const preLoader = await client.getSingle('preloader')
    const navigation = await client.getSingle('navigation')
    const home = await client.getSingle('home')
    const about = await client.getSingle('about')
    const graphQuery = `{
        collection {
            products {
                products_product {
                    product
                }
            }
        }
    }`
    const collections = await client.getAllByType('collection', { graphQuery })
    const collectionImages = collections.map((data) =>
        data.data.products.map((data) => data.products_product.data.product.url)
    )
    // const collections = await client.query(Prismic.Predicates.at('document.type', 'collection'), {
    //     fetchLinks: 'product.image',
    // })

    res.locals.navigation = navigation
    res.locals.preloader = preLoader
    res.locals.meta = menuContent

    home.data.gallery.forEach((item) => {
        assets.push(item.image.url)
    })

    about.data.gallery.forEach((item) => {
        assets.push(item.image.url)
    })

    about.data.body.forEach((section) => {
        if (section.slice_type === 'gallery') {
            section.items.forEach((item) => {
                assets.push(item.image.url)
            })
        }
    })

    collectionImages.forEach((collection) => {
        assets.push(collection[0])
    })

    res.locals.assets = assets

    next()
})

app.get('/', async (req, res) => {
    const collections = await client.getAllByType('collection')
    const document = await client.getSingle('home')
    res.render('pages/home', { home: document.data, collections })
})

app.get('/about', async (req, res) => {
    const about = await client.getSingle('about')
    res.render('pages/about', { about: about.data })
})

app.get('/collections', async (req, res) => {
    const graphQuery = `{
        collection {
            title
            description
            products {
                products_product {
                    title
                    product
                    uid
                }
            }
        }
    }`
    const document = await client.getAllByType('collection', { graphQuery })
    const home = await client.getSingle('home')
    res.render('pages/collections', { collections: document.map((data) => data), home })
})

app.get('/detail/:uid', async (req, res) => {
    try {
        const { uid } = req.params
        const document = await client.getByUID('product', uid)

        res.render('pages/detail', { product: document.data })
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log('listening on port ' + port)
})
