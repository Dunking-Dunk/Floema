import GSAP from 'gsap'

class Colors {
    constructor() {}

    change({ backgroundColor, color }) {
        GSAP.to(document.documentElement, {
            backgroundColor,
            color,
            duration: 0.5,
        })
    }
}

export const colorsManager = new Colors()
