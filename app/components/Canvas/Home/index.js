import Media from './Media.js'
import map from 'lodash/map.js'
import GSAP from 'gsap'

import { Plane, Transform } from 'ogl'

export default class Home {
    constructor({ gl, sizes, scene }) {
        this.gl = gl
        this.sizes = sizes
        this.scene = scene
        this.group = new Transform()
        this.galleryElement = document.querySelector('.home__gallery')
        this.mediasElement = document.querySelectorAll('.home__gallery__media__image')
        this.group.setParent(scene)
        this.createGeometry()
        this.createGallery()

        this.onResize({
            sizes: this.sizes,
        })

        this.x = {
            current: 0,
            target: 0,
            direction: '',
            lerp: 0.1,
        }

        this.y = {
            current: 0,
            target: 0,
            lerp: 0.1,
            direction: '',
        }
        this.scrollCurrent = {
            x: 0,
            y: 0,
        }

        this.scroll = {
            x: 0,
            y: 0,
        }
    }

    createGeometry() {
        this.plane = new Plane(this.gl)
    }

    createGallery() {
        this.medias = map(
            this.mediasElement,
            (element, index) =>
                new Media({
                    element,
                    index,
                    geometry: this.plane,
                    gl: this.gl,
                    scene: this.group,
                    sizes: this.sizes,
                })
        )
    }

    show() {
        map(this.medias, (media) => media.show())
    }

    hide() {
        map(this.medias, (media) => media.hide())
    }

    onResize(event) {
        this.galleryBounds = this.galleryElement.getBoundingClientRect()
        this.sizes = event.sizes

        this.gallerySizes = {
            height: this.galleryBounds.height / window.innerHeight + this.sizes.height + 1,
            width: this.galleryBounds.width / window.innerWidth + this.sizes.width + 0.5,
        }

        // this.scroll.x = this.x.target = 0
        // this.scroll.y = this.y.target = 0

        this.medias.forEach((media) => media.onResize(event.sizes))
    }

    onTouchDown({ x, y }) {
        this.scrollCurrent.x = this.scroll.x
        this.scrollCurrent.y = this.scroll.y
    }

    onTouchMove({ x, y }) {
        const xDistance = x.start - x.end
        const yDistance = y.start - y.end
        this.x.target = this.scrollCurrent.x - xDistance
        this.y.target = this.scrollCurrent.y - yDistance
    }

    onTouchUp({ x, y }) {}

    onWheel({ pixelX, pixelY }) {
        this.x.target += pixelX
        this.y.target += pixelY
    }

    update() {
        if (!this.galleryBounds) return
        this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, this.x.lerp)
        this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp)

        if (this.scroll.x < this.x.current) {
            this.x.direction = 'right'
        } else if (this.scroll.x > this.x.current) {
            this.x.direction = 'left'
        }
        if (this.scroll.y < this.y.current) {
            this.y.direction = 'top'
        } else if (this.scroll.y > this.y.current) {
            this.y.direction = 'bottom'
        }

        this.scroll.x = this.x.current
        this.scroll.y = this.y.current

        map(this.medias, (media, index) => {
            const scaleX = media.mesh.scale.x / 2
            const offsetX = this.sizes.width * 0.6

            if (this.x.direction === 'left') {
                const x = media.mesh.position.x + scaleX

                if (x < -offsetX) {
                    media.extra.x += this.gallerySizes.width

                    // media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.05, Math.PI * 0.05)
                }
            } else if (this.x.direction === 'right') {
                const x = media.mesh.position.x - scaleX

                if (x > offsetX) {
                    media.extra.x -= this.gallerySizes.width

                    // media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.05, Math.PI * 0.05)
                }
            }

            const scaleY = media.mesh.scale.y / 2
            const offsetY = this.sizes.height * 0.6

            if (this.y.direction === 'top') {
                const y = media.mesh.position.y - scaleY

                if (y < -offsetY / 0.5) {
                    media.extra.y += this.gallerySizes.height

                    // media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.05, Math.PI * 0.05)
                }
            } else if (this.y.direction === 'bottom') {
                const y = media.mesh.position.y - scaleY

                if (y > offsetY) {
                    media.extra.y -= this.gallerySizes.height

                    // media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.05, Math.PI * 0.05)
                }
            }
            media.update(this.scroll)
        })
        this.y.target -= 1
    }

    destroy() {
        this.scene.removeChild(this.group)
    }
}
