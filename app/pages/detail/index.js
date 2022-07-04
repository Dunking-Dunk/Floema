import Page from '../../classes/Page.js'
import Button from '../../classes/Button.js'

class Detail extends Page {
    constructor() {
        super({
            element: '.detail',
            id: 'detail',
            elements: {
                link: '.detail__button',
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

export default Detail
