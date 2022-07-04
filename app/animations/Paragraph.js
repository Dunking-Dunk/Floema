import Animation from '../classes/Animation.js'
import each from 'lodash/each.js'
import GSAP from 'gsap'
import { calculate, split } from '../utils/text.js'

class Paragraph extends Animation {
    constructor({ element, elements }) {
        super({
            element,
            elements,
        })

        this.elementLinesSpans = split({
            append: true,
            element: this.element,
        })
    }

    animateIn() {
        this.timelineIn = GSAP.timeline({ delay: 0.5 })
        GSAP.set(this.element, {
            autoAlpha: 1,
        })

        each(this.elementLines, (line, index) => {
            this.timelineIn.fromTo(
                line,
                {
                    autoAlpha: 0,
                    y: '100%',
                },
                {
                    autoAlpha: 1,
                    delay: index * 0.1,

                    ease: 'expo.out',
                    y: '0%',
                },
                0
            )
        })
    }

    animateOut() {
        GSAP.set(this.element, {
            autoAlpha: 0,
        })
    }

    onResize() {
        this.elementLines = calculate(this.elementLinesSpans)
    }
}

export default Paragraph
