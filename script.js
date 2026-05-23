;(function(){
'use strict'

const heroCanvas = document.getElementById('heroCanvas')
if(heroCanvas){
    const ctx = heroCanvas.getContext('2d')
    let particles = []
    let mouseX = 0, mouseY = 0
    const resized = () => {
        heroCanvas.width = heroCanvas.offsetWidth
        heroCanvas.height = heroCanvas.offsetHeight
    }
    resized()
    window.addEventListener('resize', resized)

    class Particle {
        constructor(){
            this.reset()
        }
        reset(){
            this.x = Math.random() * heroCanvas.width
            this.y = Math.random() * heroCanvas.height
            this.size = Math.random() * 2 + .5
            this.speedX = (Math.random() - .5) * .6
            this.speedY = (Math.random() - .5) * .6
            this.opacity = Math.random() * .5 + .1
            this.hue = Math.random() * 60 + 240
        }
        update(){
            this.x += this.speedX
            this.y += this.speedY
            const dx = mouseX - this.x
            const dy = mouseY - this.y
            const dist = Math.sqrt(dx*dx + dy*dy)
            if(dist < 200){
                this.x -= dx * .003
                this.y -= dy * .003
            }
            if(this.x < 0 || this.x > heroCanvas.width ||
               this.y < 0 || this.y > heroCanvas.height){
                this.reset()
            }
        }
        draw(){
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2)
            ctx.fillStyle = `hsla(${this.hue},70%,70%,${this.opacity})`
            ctx.fill()
        }
    }

    for(let i=0;i<120;i++) particles.push(new Particle())

    let mouseTimeout
    document.addEventListener('mousemove', e => {
        const rect = heroCanvas.getBoundingClientRect()
        mouseX = e.clientX - rect.left
        mouseY = e.clientY - rect.top
        clearTimeout(mouseTimeout)
        mouseTimeout = setTimeout(() => { mouseX = -1000; mouseY = -1000 }, 2000)
    })

    function animate(){
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height)
        for(const p of particles){
            p.update()
            p.draw()
        }
        // connections
        for(let i=0;i<particles.length;i++){
            for(let j=i+1;j<particles.length;j++){
                const dx = particles[i].x - particles[j].x
                const dy = particles[i].y - particles[j].y
                const dist = Math.sqrt(dx*dx + dy*dy)
                if(dist < 150){
                    ctx.beginPath()
                    ctx.moveTo(particles[i].x, particles[i].y)
                    ctx.lineTo(particles[j].x, particles[j].y)
                    ctx.strokeStyle = `hsla(250,50%,60%,${.08*(1-dist/150)})`
                    ctx.lineWidth = .5
                    ctx.stroke()
                }
            }
        }
        requestAnimationFrame(animate)
    }
    animate()
}

// Intersection Observer for scroll-triggered animations
const observerOptions = { threshold: .15, rootMargin: '0px 0px -50px 0px' }
const observer = new IntersectionObserver((entries) => {
    for(const entry of entries){
        if(entry.isIntersecting){
            const el = entry.target
            const delay = el.dataset.delay || 0
            setTimeout(() => el.classList.add('visible'), parseInt(delay))
            observer.unobserve(el)
        }
    }
}, observerOptions)

document.querySelectorAll('.service-card, .advantage-item, .step').forEach(el => {
    observer.observe(el)
})

// Navbar background on scroll
const navbar = document.getElementById('navbar')
let ticking = false
window.addEventListener('scroll', () => {
    if(!ticking){
        requestAnimationFrame(() => {
            navbar.classList.toggle('scrolled', window.scrollY > 60)
            ticking = false
        })
        ticking = true
    }
})

// Mobile menu toggle
const toggle = document.getElementById('navToggle')
const navLinks = document.querySelector('.nav-links')
if(toggle && navLinks){
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active')
        navLinks.classList.toggle('open')
    })
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', () => {
            toggle.classList.remove('active')
            navLinks.classList.remove('open')
        })
    })
}

// Hidden admin panel — double-click logo
document.querySelector('.logo')?.addEventListener('dblclick', () => {
    location.href = '/go/'
})

})()

