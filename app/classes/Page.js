import each from 'lodash/each.js'
import GSAP from 'gsap'
import Prefix from 'prefix'

import Title from '../animations/Title.js'
import Highlight from '../animations/Highlight.js'
import Label from '../animations/Label.js'
import Paragraph from '../animations/Paragraph.js'
import { colorsManager } from './Colors.js'
import AsyncLoad from './AsyncLoad.js'

export default class Page {
    constructor({ element, elements, id }) {
        this.selector = element
        this.selectorChildren = {
            ...elements,
            preloaders: '[data-src]',
        }
        this.id = id
        this.transformPrefix = Prefix('transform')
        this.scroll = {
            current: 0,
            target: 0,
            limit: 0,
        }
        // this.onMouseWheelEvent = this.onMouseWheel.bind(this)
    }

    create() {
        this.element = document.querySelector(this.selector)
        this.elements = {}
        this.scroll = {
            current: 0,
            target: 0,
            limit: 0,
        }

        each(this.selectorChildren, (selector, key) => {
            if (
                selector instanceof window.HTMLElement ||
                selector instanceof window.NodeList ||
                Array.isArray(selector)
            ) {
                this.elements[key] = selector
            } else {
                this.elements[key] = this.element.querySelectorAll(selector)
                if (this.elements[key].length === 0) {
                    this.elements[key] = null
                } else if (this.elements[key].length === 1) {
                    this.elements[key] = this.element.querySelector(selector)
                }
            }
        })
        this.createAnimations()
        this.createPreloader()
    }

    createAnimations() {
        this.animationsTitles = []
        this.animationsParagraphs = []
        this.animationsLabels = []
        this.animationsHighlights = []

        if (this.elements.animationTitles) {
            for (let i = 0; this.elements.animationTitles.length > i; i++) {
                const c = new Title({ element: this.elements.animationTitles[i] })
                this.animationsTitles.push(c)
            }
        }
        if (this.elements.animationParagraphs) {
            for (let i = 0; this.elements.animationParagraphs.length > i; i++) {
                const c = new Paragraph({ element: this.elements.animationParagraphs[i] })
                this.animationsParagraphs.push(c)
            }
        }
        if (this.elements.animationLabels) {
            for (let i = 0; this.elements.animationLabels.length > i; i++) {
                const c = new Label({ element: this.elements.animationLabels[i] })
                this.animationsLabels.push(c)
            }
        }
        if (this.elements.animationHighlights) {
            for (let i = 0; this.elements.animationHighlights.length > i; i++) {
                const c = new Highlight({ element: this.elements.animationHighlights[i] })
                this.animationsHighlights.push(c)
            }
        }

        this.animations = [
            ...this.animationsTitles,
            ...this.animationsParagraphs,
            ...this.animationsLabels,
            ...this.animationsHighlights,
        ]
    }

    createPreloader() {
        for (let i = 0; this.elements.preloaders.length > i; i++) {
            new AsyncLoad({ element: this.elements.preloaders[i] })
        }
    }
    // animation

    show(animation) {
        return new Promise((resolve) => {
            colorsManager.change({
                backgroundColor: this.element.getAttribute('data-background'),
                color: this.element.getAttribute('data-color'),
            })
            if (animation) {
                this.animationIn = animation
            } else {
                this.animationIn = GSAP.timeline()
                this.animationIn.fromTo(
                    this.element,
                    {
                        autoAlpha: 0,
                    },
                    {
                        autoAlpha: 1,
                    }
                )
            }

            this.animationIn.call((_) => {
                this.addEventListeners()

                resolve()
            })
        })
    }

    hide() {
        return new Promise((resolve) => {
            this.destroy()
            this.animationOut = GSAP.timeline()
            this.animationOut.to(this.element, {
                autoAlpha: 0,
                onComplete: resolve,
            })
        })
    }

    // events
    onResize() {
        if (this.elements?.wrapper) {
            this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
        }

        each(this.animations, (animation) => animation.onResize())
    }

    onWheel({ pixelY }) {
        this.scroll.target += pixelY
    }

    // loop
    update() {
        this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)

        if (this.scroll.target < 0.01) {
            this.scroll.target = 0
        }

        this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

        if (this.elements?.wrapper) {
            this.elements.wrapper.style[
                this.transformPrefix
            ] = `translateY(-${this.scroll.current}px)`
        }
    }

    // listeners
    addEventListeners() {}

    removeEventListeners() {
        window.removeEventListener('mousewheel', this.onMouseWheelEvent)
    }

    // listeners

    destroy() {
        this.removeEventListeners()
    }
}
