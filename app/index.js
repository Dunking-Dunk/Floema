import each from 'lodash/each.js'

import About from './pages/about/index.js'
import Collections from './pages/collections/index.js'
import Detail from './pages/detail/index.js'
import Home from './pages/home/index.js'
import Preloader from './components/Preloader.js'
import Navigation from './components/Navigation.js'
import Canvas from './components/Canvas/index.js'
import normalizeWheel from 'normalize-wheel'

class App {
    constructor() {
        this.createContent()

        this.createCanvas()
        this.createPreloader()
        this.createNavigation()

        this.createPages()

        this.addEventListeners()
        this.addLinkListeners()

        this.onResize()
        this.update()
    }

    createNavigation() {
        this.navigation = new Navigation({ template: this.template })
    }

    createPreloader() {
        this.preloader = new Preloader({
            canvas: this.canvas,
        })
        this.preloader.once('completed', this.onPreloaded.bind(this))
    }

    createCanvas() {
        this.canvas = new Canvas({
            template: this.template,
        })
    }

    createPages() {
        this.pages = {
            home: new Home(),
            collections: new Collections(),
            detail: new Detail(),
            about: new About(),
        }

        this.page = this.pages[this.template]
        this.page.create()
    }

    createContent() {
        this.content = document.querySelector('.content')
        this.template = this.content.getAttribute('data-template')
    }

    onPreloaded() {
        this.onResize()

        this.canvas.onPreloaded()

        this.page.show()
    }

    onPopState() {
        this.onChange({
            url: window.location.pathname,
            push: true,
        })
    }

    async onChange(url, push = true) {
        this.canvas.onChangeStart(this.template, url)

        await this.page.hide()

        const request = await window.fetch(url)

        if (request.status === 200) {
            const html = await request.text()
            const div = document.createElement('div')

            if (push) {
                window.history.pushState({}, '', url)
            }

            div.innerHTML = html

            const divContent = div.querySelector('.content')
            this.template = divContent.getAttribute('data-template')

            this.content.setAttribute('data-template', this.template)

            this.navigation.onChange(this.template)

            this.content.innerHTML = divContent.innerHTML

            this.canvas.onChangeEnd(this.template)

            this.page = this.pages[this.template]

            this.page.create()

            this.onResize()

            this.page.show()
            this.addLinkListeners()
        } else {
            console.log('error')
        }
    }

    addLinkListeners() {
        const links = document.querySelectorAll('a')
        each(links, (link) => {
            link.onclick = (event) => {
                event.preventDefault()
                const { href } = link
                this.onChange(href)
            }
        })
    }

    update() {
        if (this.page && this.page.update) {
            this.page.update()
        }
        if (this.canvas && this.canvas.update) {
            this.canvas.update(this.page.scroll)
        }

        this.frame = window.requestAnimationFrame(this.update.bind(this))
    }

    addEventListeners() {
        window.addEventListener('mousedown', this.onTouchDown.bind(this))
        window.addEventListener('mouseup', this.onTouchUp.bind(this))
        window.addEventListener('mousemove', this.onTouchMove.bind(this))

        window.addEventListener('touchstart', this.onTouchDown.bind(this))
        window.addEventListener('touchmove', this.onTouchMove.bind(this))
        window.addEventListener('touchend', this.onTouchUp.bind(this))

        window.addEventListener('mousewheel', this.onWheel.bind(this))
        window.addEventListener('resize', this.onResize.bind(this))
    }

    onTouchDown(event) {
        if (this.canvas && this.canvas.onTouchDown) {
            this.canvas.onTouchDown(event)
        }
    }

    onTouchMove(event) {
        if (this.canvas && this.canvas.onTouchMove) {
            this.canvas.onTouchMove(event)
        }
    }

    onTouchUp(event) {
        if (this.canvas && this.canvas.onTouchUp) {
            this.canvas.onTouchUp(event)
        }
    }

    onWheel(event) {
        const scrollwheel = normalizeWheel(event)
        if (this.page && this.page.onResize) {
            this.page.onWheel(scrollwheel)
        }
        if (this.canvas && this.canvas.onResize) {
            this.canvas.onWheel(scrollwheel)
        }
    }

    onResize() {
        if (this.page && this.page.onResize) {
            this.page.onResize()
        }

        window.requestAnimationFrame(() => {
            if (this.canvas && this.canvas.onResize) {
                this.canvas.onResize()
            }
        })
    }
}

new App()
