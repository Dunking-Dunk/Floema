import Page from '../../classes/Page.js'

class About extends Page {
    constructor() {
        super({
            element: '.about',
            id: 'about',
            elements: {
                title: '.about__title',
                navigation: document.querySelector('.navigation'),
                wrapper: '.about__wrapper',
                animationTitles: '[data-animation="title"]',
                animationParagraphs: '[data-animation="paragraph"]',
                animationLabels: '[data-animation="label"]',
                animationHighlights: '[data-animation="highlight"]',
            },
        })
    }
}
export default About
