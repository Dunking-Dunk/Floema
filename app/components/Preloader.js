import Component from '../classes/Component.js'
import each from 'lodash/each.js'
import GSAP from 'gsap'
import { split } from '../utils/text.js'
import { Texture } from 'ogl'

export default class Preloader extends Component {
    constructor({ canvas }) {
        super({
            element: '.preloader',
            elements: {
                title: '.preloader__text',
                number: '.preloader__number',
                numberText: '.preloader__number__text',
            },
        })

        this.canvas = canvas
        window.TEXTURES = {}

        split({
            element: this.elements.title,
            expression: '<br>',
        })

        split({
            element: this.elements.title,
            expression: '<br>',
        })

        this.elements.titleSpans = this.elements.title.querySelectorAll('span span')
        this.length = 0
        this.createLoader()
    }

    createLoader() {
        each(window.ASSETS, (image) => {
            const texture = new Texture(this.canvas.gl, {
                generateMipmaps: false,
            })

            const media = new window.Image()

            media.crossOrigin = 'anonymous'
            media.src = image

            media.onload = () => {
                texture.image = media

                this.onAssetLoaded()
            }

            window.TEXTURES[image] = texture
        })
    }

    onAssetLoaded(image) {
        this.length += 1

        const percent = this.length / window.ASSETS.length

        this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`

        if (percent === 1) {
            this.onLoaded()
        }
    }

    onLoaded() {
        return new Promise((resolve) => {
            this.emit('completed')
            this.animateOut = GSAP.timeline({
                delay: 2,
            })

            this.animateOut.to(this.elements.titleSpans, {
                autoAlpha: 0,
                duration: 1.5,
                ease: 'expo.out',
                stagger: 0.1,
                y: '100%',
            })
            this.animateOut.to(
                this.elements.numberText,
                {
                    autoAlpha: 0,
                    duration: 1.5,
                    ease: 'expo.out',
                    stagger: 0.1,
                    y: '100%',
                },
                '-=1.4'
            )
            this.animateOut.to(this.element, {
                autoAlpha: 0,
                duration: 1.5,
            })
            this.animateOut.call(() => {
                this.destroy()
            })
        })
    }

    destroy() {
        this.element.parentNode.removeChild(this.element)
    }
}
