import Component from './Component.js'
import GSAP from 'gsap'

export default class Button extends Component {
    constructor({ element }) {
        super({ element })

        this.path = element.querySelector('path:last-child')
        this.pathLength = this.path.getTotalLength()
        this.timeline = GSAP.timeline({ paused: true })

        this.timeline.fromTo(
            this.path,
            {
                strokeDashoffset: this.pathLength,
                strokeDasharray: `${this.pathLength} ${this.pathLength}`,
            },
            {
                strokeDashoffset: 0,
                strokeDasharray: `${this.pathLength} ${this.pathLength}`,
            }
        )
    }

    addEventListeners() {
        this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this))

        this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    }

    removeEventListeners() {
        this.element.removeEventListener('mouseenter', this.onMouseEnter.bind(this))

        this.element.removeEventListener('mouseleave', this.onMouseLeave.bind(this))
    }

    onMouseEnter() {
        this.timeline.play()
    }

    onMouseLeave() {
        this.timeline.reverse()
    }
}
