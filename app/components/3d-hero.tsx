"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const Hero3D = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x8b5dff, 2)
    pointLight1.position.set(2, 3, 4)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xf09319, 2)
    pointLight2.position.set(-2, -3, 2)
    scene.add(pointLight2)

    // Create a group for all objects
    const group = new THREE.Group()
    scene.add(group)

    // Create code-related objects
    // 1. Floating cubes representing code blocks
    const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
    const cubeMaterial1 = new THREE.MeshStandardMaterial({
      color: 0x8b5dff,
      metalness: 0.7,
      roughness: 0.2,
    })
    const cubeMaterial2 = new THREE.MeshStandardMaterial({
      color: 0xf09319,
      metalness: 0.7,
      roughness: 0.2,
    })

    // Create multiple cubes
    for (let i = 0; i < 15; i++) {
      const material = i % 2 === 0 ? cubeMaterial1 : cubeMaterial2
      const cube = new THREE.Mesh(cubeGeometry, material)

      // Position cubes randomly in a spherical pattern
      const radius = 2.5
      const theta = THREE.MathUtils.randFloatSpread(360)
      const phi = THREE.MathUtils.randFloatSpread(360)

      cube.position.x = radius * Math.sin(theta) * Math.cos(phi)
      cube.position.y = radius * Math.sin(theta) * Math.sin(phi)
      cube.position.z = radius * Math.cos(theta)

      cube.rotation.x = Math.random() * Math.PI
      cube.rotation.y = Math.random() * Math.PI

      // Add to group
      group.add(cube)
    }

    // 2. Central sphere representing the "brain" or central processing
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1,
    })

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    group.add(sphere)

    // 3. Connecting lines between objects
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x8b5dff,
      transparent: true,
      opacity: 0.5,
    })

    // Connect each cube to the central sphere
    group.children.forEach((child, index) => {
      if (child !== sphere) {
        const points = []
        points.push(new THREE.Vector3(0, 0, 0)) // Sphere center
        points.push(child.position.clone()) // Cube position

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(lineGeometry, lineMaterial)
        group.add(line)
      }
    })

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate the entire group
      group.rotation.y += 0.002

      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 -z-10" />
}

export default Hero3D
