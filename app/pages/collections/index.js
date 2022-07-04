import Page from '../../classes/Page.js'

class Collections extends Page {
    constructor() {
        super({
            element: '.collections',
            id: 'collections',
            elements: {
                wrapper: '.collections__wrapper',
            },
        })
    }
}

export default Collections
