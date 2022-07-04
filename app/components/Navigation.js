import GSAP from 'gsap'
import Component from '../classes/Component.js'
import each from 'lodash/each.js'
import { COLOR_QUARTER_TUNA, COLOR_LINEN } from '../utils/color.js'

export default class Navigation extends Component {
    constructor({ template }) {
        super({
            element: '.navigation',
            elements: {
                items: '.navigation__list__item',
                links: '.navigation__list__link',
            },
        })

        this.onChange(template)
    }

    onChange(template) {
        if (template === 'about') {
            GSAP.to(this.element, {
                color: COLOR_QUARTER_TUNA,
                duration: 1.5,
            })

            GSAP.to(this.elements.items[0], {
                autoAlpha: 0,
                duration: 0.75,
            })
            GSAP.to(this.elements.items[1], {
                autoAlpha: 1,
                delay: 0.75,
                duration: 0.75,
            })
        } else {
            GSAP.to(this.element, {
                color: COLOR_LINEN,
                duration: 1.5,
            })

            GSAP.to(this.elements.items[0], {
                autoAlpha: 1,
                delay: 0.75,
                duration: 0.75,
            })
            GSAP.to(this.elements.items[1], {
                autoAlpha: 0,
                duration: 0.75,
            })
        }
    }
}
