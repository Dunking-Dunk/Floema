import { Program, Mesh, Texture } from 'ogl'
import GSAP from 'gsap'

import vertex from '../../../shaders/plane-vertex.glsl'
import fragment from '../../../shaders/plane-fragment.glsl'

export default class Media {
    constructor({ element, gl, geometry, scene, index, sizes }) {
        this.element = element
        this.gl = gl
        this.geometry = geometry
        this.scene = scene
        this.index = index
        this.sizes = sizes
        this.createTexture()
        this.createProgram()
        this.createMesh()

        this.extra = {
            x: 0,
            y: 0,
        }
    }

    createTexture() {
        const image = this.element
        this.texture = window.TEXTURES[image.getAttribute('data-src')]
    }

    createProgram() {
        this.program = new Program(this.gl, {
            fragment,
            vertex,
            uniforms: {
                tMap: { value: this.texture },
            },
            cullFace: null,
        })
    }

    createMesh() {
        this.mesh = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program,
        })
        this.mesh.position.x = this.index + this.mesh.scale.x
        this.mesh.setParent(this.scene)
        this.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.01, Math.PI * 0.01)
    }

    createBounds(sizes) {
        this.sizes = sizes
        this.bounds = this.element.getBoundingClientRect()
        this.updateScale()
        this.updateX()
        this.updateY()
    }

    show() {
        GSAP.fromTo(
            this.program.uniforms.uAlpha,
            {
                value: 0,
            },
            {
                value: 0.4,
            }
        )
    }

    hide() {
        GSAP.to(this.program.uniforms.uAlpha, {
            value: 0,
        })
    }

    updateScale() {
        this.width = this.bounds.width / window.innerWidth
        this.height = this.bounds.height / window.innerHeight

        this.mesh.scale.x = this.width * this.sizes.width
        this.mesh.scale.y = this.height * this.sizes.height
    }

    updateX(x = 0) {
        this.x = (this.bounds.left + x) / window.innerWidth

        this.mesh.position.x =
            -this.sizes.width / 2 + this.mesh.scale.x / 2 + this.x * this.sizes.width + this.extra.x
    }

    updateY(y = 0) {
        this.y = (this.bounds.top + y) / window.innerHeight

        this.mesh.position.y =
            this.sizes.height / 2 -
            this.mesh.scale.y / 2 -
            this.y * this.sizes.height +
            this.extra.y
    }

    update(scroll) {
        if (!this.bounds) return
        this.updateX(scroll && scroll.x)
        this.updateY(scroll && scroll.y)
    }

    onResize(sizes) {
        this.createBounds(sizes)
    }
}
