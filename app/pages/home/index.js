import Page from '../../classes/Page.js'
import Button from '../../classes/Button.js'
import Masonry from 'masonry-layout'

class Home extends Page {
    constructor() {
        super({
            element: '.home',
            id: 'home',
            elements: {
                link: '.home__link',
                navigation: document.querySelector('.navigation'),
                grid: document.querySelector('.home__gallery'),
            },
        })
    }

    create() {
        super.create()
        this.link = new Button({
            element: this.elements.link,
        })
    }

    destroy() {
        super.destroy()
        this.link.removeEventListeners()
    }
}

export default Home
