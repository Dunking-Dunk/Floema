import GSAP from 'gsap'

import Animation from '../classes/Animation.js'

export default class Highlight extends Animation {
    constructor({ element, elements }) {
        super({
            element,
            elements,
        })
    }

    animateIn() {
        this.timelineIn = GSAP.timeline({
            delay: 0.5,
        })
        GSAP.set(this.element, {
            autoAlpha: 1,
        })

        this.timelineIn.fromTo(
            this.element,
            {
                autoAlpha: 0,
                scale: 1,
            },
            {
                autoAlpha: 1,
                duration: 1.5,
                ease: 'expo.out',
                scale: 1.3,
            }
        )
    }

    animateOut() {
        GSAP.set(this.element, {
            autoAlpha: 0,
        })
    }
}
