import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AmbientLight, BufferAttribute, BufferGeometry, Color, DirectionalLight, DoubleSide, Fog, Line, LineBasicMaterial, Mesh, MeshPhongMaterial, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer} from 'three';

  // import Stats from 'three/addons/libs/stats.module.js';


@Component({
  selector: 'welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent implements OnInit  {

  @ViewChild('container', { static: true }) container: ElementRef | undefined;

  ngOnInit(): void {
    let container;//, stats;

    let camera:PerspectiveCamera, scene:Scene, renderer:WebGLRenderer;

    let raycaster:Raycaster, pointer:Vector2;

    let mesh:Mesh, line:Line;

    // container = document.getElementById( 'container' );

    //

    camera = new PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
    camera.position.z = 2750;

    scene = new Scene();
    scene.background = new Color( 'black' );
    scene.fog = new Fog( 0x050505, 2000, 3500 );

    //

    scene.add( new AmbientLight( 0x444444, 3 ) );

    const light1 = new DirectionalLight( 0xffffff, 1.5 );
    light1.position.set( 1, 1, 1 );
    scene.add( light1 );

    const light2 = new DirectionalLight( 0xffffff, 4.5 );
    light2.position.set( 0, - 1, 0 );
    scene.add( light2 );

    //

    const triangles = 5000;

    let geometry = new BufferGeometry();

    const positions = new Float32Array( triangles * 3 * 3 );
    const normals = new Float32Array( triangles * 3 * 3 );
    const colors = new Float32Array( triangles * 3 * 3 );

    const color = new Color();

    const n = 800, n2 = n / 2;	// triangles spread in the cube
    const d = 120, d2 = d / 2;	// individual triangle size

    const pA = new Vector3();
    const pB = new Vector3();
    const pC = new Vector3();

    const cb = new Vector3();
    const ab = new Vector3();

    for ( let i = 0; i < positions.length; i += 9 ) {

      // positions

      const x = Math.random() * n - n2;
      const y = Math.random() * n - n2;
      const z = Math.random() * n - n2;

      const ax = x + Math.random() * d - d2;
      const ay = y + Math.random() * d - d2;
      const az = z + Math.random() * d - d2;

      const bx = x + Math.random() * d - d2;
      const by = y + Math.random() * d - d2;
      const bz = z + Math.random() * d - d2;

      const cx = x + Math.random() * d - d2;
      const cy = y + Math.random() * d - d2;
      const cz = z + Math.random() * d - d2;

      positions[ i ] = ax;
      positions[ i + 1 ] = ay;
      positions[ i + 2 ] = az;

      positions[ i + 3 ] = bx;
      positions[ i + 4 ] = by;
      positions[ i + 5 ] = bz;

      positions[ i + 6 ] = cx;
      positions[ i + 7 ] = cy;
      positions[ i + 8 ] = cz;

      // flat face normals

      pA.set( ax, ay, az );
      pB.set( bx, by, bz );
      pC.set( cx, cy, cz );

      cb.subVectors( pC, pB );
      ab.subVectors( pA, pB );
      cb.cross( ab );

      cb.normalize();

      const nx = cb.x;
      const ny = cb.y;
      const nz = cb.z;

      normals[ i ] = nx;
      normals[ i + 1 ] = ny;
      normals[ i + 2 ] = nz;

      normals[ i + 3 ] = nx;
      normals[ i + 4 ] = ny;
      normals[ i + 5 ] = nz;

      normals[ i + 6 ] = nx;
      normals[ i + 7 ] = ny;
      normals[ i + 8 ] = nz;

      // colors

      const vx = ( x / n ) + 0.5;
      const vy = ( y / n ) + 0.5;
      const vz = ( z / n ) + 0.5;

      color.setRGB( vx, vy, vz );

      colors[ i ] = color.r;
      colors[ i + 1 ] = color.g;
      colors[ i + 2 ] = color.b;

      colors[ i + 3 ] = color.r;
      colors[ i + 4 ] = color.g;
      colors[ i + 5 ] = color.b;

      colors[ i + 6 ] = color.r;
      colors[ i + 7 ] = color.g;
      colors[ i + 8 ] = color.b;

    }

    geometry.setAttribute( 'position', new BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'normal', new BufferAttribute( normals, 3 ) );
    geometry.setAttribute( 'color', new BufferAttribute( colors, 3 ) );

    geometry.computeBoundingSphere();

    let material:LineBasicMaterial | MeshPhongMaterial = new MeshPhongMaterial( {
      color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
      side: DoubleSide, vertexColors: true
    } );

    mesh = new Mesh( geometry, material );
    scene.add( mesh );

    //

    raycaster = new Raycaster();

    pointer = new Vector2();

    geometry = new BufferGeometry();
    geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( 4 * 3 ), 3 ) );

    material = new LineBasicMaterial( { color: 0xffffff, transparent: true } );

    line = new Line( geometry, material );
    scene.add( line );

    //

    renderer = new WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth / 2 , window.innerHeight / 2 );
    renderer.setAnimationLoop( animate );
    // renderer.domElement.classList.add("canvas-container");
    this.container?.nativeElement?.appendChild( renderer.domElement );

    //

    // stats = new Stats();
    // container?.appendChild( stats.dom );

    //

    window.addEventListener( 'resize', onWindowResize );
    document.addEventListener( 'pointermove', onPointerMove );

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
  
      renderer.setSize( window.innerWidth, window.innerHeight );
  
    }
  
    function onPointerMove( event:any ) {
  
      pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
    }

    function animate() {

      render();
      // stats.update();
  
    }
  
    function render() {
  
      const time = Date.now() * 0.001;
  
      mesh.rotation.x = time * 0.15;
      mesh.rotation.y = time * 0.25;
  
      raycaster.setFromCamera( pointer, camera );
  
      const intersects = raycaster.intersectObject( mesh );
  
      if ( intersects.length > 0 ) {
  
        const intersect = intersects[ 0 ];
        const face = intersect.face;
  
        const linePosition = (line.geometry.attributes as any).position;
        const meshPosition = (mesh.geometry.attributes as any).position;
  
        linePosition.copyAt( 0, meshPosition, face?.a );
        linePosition.copyAt( 1, meshPosition, face?.b );
        linePosition.copyAt( 2, meshPosition, face?.c );
        linePosition.copyAt( 3, meshPosition, face?.a );
  
        mesh.updateMatrix();
  
        line.geometry.applyMatrix4( mesh.matrix );
  
        line.visible = true;
  
      } else {
  
        line.visible = false;
  
      }
  
      renderer.render( scene, camera );
  
    }

  }

}
