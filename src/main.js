
// Skybox texture from: https://github.com/mrdoob/three.js/tree/master/examples/textures/cube/skybox

const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'

// Helper vars
// var l="0x2f2c31";
// var m="0x231e1e";
// var s="0x191517";
var fs=7.0;
var a=8.0;
var fo=0.0;
var toggle=true;
var sc=2;
var w=25.0;

// GUI Controls
var GUIoptions = function()
{
	// this.ColorLong="0x2f2c31";
	// this.ColorMedium="0x231e1e";
	// this.ColorShort="0x191517";
  this.FlappingSpeed=7.0;
  this.Amplitude=8.0;
  this.Orientation=0.0;
  this.Shape=2.0;
  this.WindSpeed=25.0;
}

// called after the scene loads
function onLoad(framework) {
    var scene = framework.scene;
    var camera = framework.camera;
    var renderer = framework.renderer;
    var gui = framework.gui;
    var stats = framework.stats;

    // Color of Long Feathers
    var lambertWhite = new THREE.MeshLambertMaterial({ color: 0x2f2c31, side: THREE.DoubleSide });
    // Color of Medium Feathers
    var lambertWhite2 = new THREE.MeshLambertMaterial({ color: 0x231e1e, side: THREE.DoubleSide });
    // Color of Short Feathers
    var lambertWhite3 = new THREE.MeshLambertMaterial({ color: 0x191517, side: THREE.DoubleSide });

    // Set light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.color.setHSL(0.1, 1, 0.95);
    directionalLight.position.set(1, 3, 2);
    directionalLight.position.multiplyScalar(10);

    // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = 'images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    scene.background = skymap;

    // load a simple obj mesh
    var objLoader = new THREE.OBJLoader();
    objLoader.load('geo/feather.obj', function(obj) {

    // LOOK: This function runs after the obj has finished loading
    var featherGeo = obj.children[0].geometry;

    // curve along which feathers are plotted..
		var curve = new THREE.CatmullRomCurve3( [
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( -0.25, 0, 1),
			new THREE.Vector3( 0, 0, 2 ),
			new THREE.Vector3( 0.25, 0, 3 ),
			new THREE.Vector3( 0.15, 0, 3.5 ),
			new THREE.Vector3( 0.15, 0, 4 )
		] );

		var max=30; // Max number of Long feathers.. number of shorter feathers is a little less..

    for(var k=0; k<2; k++)
    {
  		for(var i=1; i<max+1; i++) // LONG FEATHERS
  		{
  			var FMCopy = new THREE.Mesh(featherGeo, lambertWhite);
  			var ind = curve.getPoint( i/max );
  			var pos = new THREE.Vector3(ind.x,ind.y,ind.z);

  			FMCopy.position.x=pos.x;//+(Math.random()-0.5)*0.1;
  			FMCopy.position.y=pos.y;//+(Math.random()-0.5)*0.01;
  			FMCopy.position.z=0.25+pos.z+(Math.random()-0.5)*0.2;

  			if(i<=max*2/3) // MAIN WING - SOFT CURVE PART
  			{
          if(k===0)
  				    FMCopy.rotation.y = i * Math.PI/180;
          if(k===1)
      				FMCopy.rotation.y = -i * Math.PI/180;
  				FMCopy.scale.set(-0.9-0.1*(Math.abs(i-max*2/3)/max*2/3),-1,1);
  			}
  			else if(i>max*2/3) // SIDE WING - HARD CURVE PART
  			{
          if(k===0)
  				    FMCopy.rotation.y = (10 * (i-max*2/3) + max*2/3) * Math.PI/180;
          if(k===1)
            FMCopy.rotation.y = - (10 * (i-max*2/3) + max*2/3) * Math.PI/180;
  				FMCopy.scale.set(-0.9-0.1*(Math.abs(i-max*2/3)/max*2/3),-1,1);
  			}

        if(k===1)
        {
          FMCopy.position.z=-FMCopy.position.z;
        }
  			FMCopy.name = "feather_long"+k+i;
  			scene.add(FMCopy);
  		}

  		for(var i=1; i<max+1-1; i++) // SHORT FEATHERS
  		{
  			var FMCopy = new THREE.Mesh(featherGeo, lambertWhite2);
  			var ind = curve.getPoint((2*i-1)/max/2); // sample double and skip 1 to get mid points!!
  			var pos = new THREE.Vector3(ind.x,ind.y,ind.z);

  			FMCopy.position.x=pos.x;//+(Math.random()-0.5)*0.1;
  			FMCopy.position.y=pos.y;//+(Math.random()-0.5)*0.01;
  			FMCopy.position.z=0.25+pos.z+(Math.random()-0.5)*0.3;
  			FMCopy.rotation.z= -3*(max*4/3-i)/max * Math.PI/180;

  			if(i<=max*2/3) // MAIN WING - SOFT CURVE PART
  			{
  				FMCopy.scale.set(-0.6-0.2*(Math.abs(i-max*2/3)/max*2/3),-1,1);
          if(k===0)
  				    FMCopy.rotation.y = i * 3/2 * Math.PI/180;
          if(k===1)
  				    FMCopy.rotation.y = - i * 3/2 * Math.PI/180;
  			}
  			else if(i>max*2/3) // SIDE WING - HARD CURVE PART
  			{
  				FMCopy.scale.set(-0.6-0.2*(Math.abs(i-max*2/3)/max*2/3),-1,1);
          if(k===0)
  				    FMCopy.rotation.y = (10 * (i-max*2/3) + max*2/3 +5) * Math.PI/180;
          if(k===1)
  				    FMCopy.rotation.y = - (10 * (i-max*2/3) + max*2/3 +5) * Math.PI/180;
  			}

        if(k===1)
        {
          FMCopy.position.z=-FMCopy.position.z;
        }
  			FMCopy.name = "feather_short"+k+i;
  			scene.add(FMCopy);
  		}

  		for(var i=1; i<max*5/6; i++) // VERY SHORT FEATHERS
  		{
  			var FMCopy = new THREE.Mesh(featherGeo, lambertWhite3);
  			var ind = curve.getPoint(i/max);
  			var pos = new THREE.Vector3(ind.x,ind.y,ind.z);

  			FMCopy.position.x=pos.x;//+(Math.random()-0.5)*0.1;
  			FMCopy.position.y=pos.y;//+(Math.random()-0.5)*0.01;
  			FMCopy.position.z=0.25+pos.z+(Math.random()-0.5)*0.2;
  			FMCopy.rotation.z= -6*(max*4/3-i)/max * Math.PI/180;

  			FMCopy.scale.set(-0.4*(1-i/35),-1,0.8);
        if(k===0)
  			   FMCopy.rotation.y = ((max*2/3-i)/max*2/3+2)/(4) * Math.PI/180;
        if(k===1)
  			   FMCopy.rotation.y = - ((max*2/3-i)/max*2/3+2)/(4) * Math.PI/180;

        if(k===1)
        {
          FMCopy.position.z=-FMCopy.position.z;
        }

  			FMCopy.name = "feather_very_short"+k+i;
  			scene.add(FMCopy);
  		}

      for(var i=max*5/6; i<max*5/6+3; i++) // VERY SHORT FEATHERS
  		{
  			var FMCopy = new THREE.Mesh(featherGeo, lambertWhite3);
  			var ind = curve.getPoint(i/max);
  			var pos = new THREE.Vector3(ind.x,ind.y,ind.z);

  			FMCopy.position.x=pos.x;//+(Math.random()-0.5)*0.1;
  			FMCopy.position.y=pos.y;//+(Math.random()-0.5)*0.01;
  			FMCopy.position.z=0.25+pos.z+(Math.random()-0.5)*0.2;
  			FMCopy.rotation.z= -6*(max*4/3-i)/max * Math.PI/180;

  			FMCopy.scale.set(-0.4,-1,0.5);
        if(k===0)
  			   FMCopy.rotation.y = (10 * (i-max*2/3) + max*2/3 +5) * Math.PI/180;
        if(k===1)
          FMCopy.rotation.y = - (10 * (i-max*2/3) + max*2/3 +5) * Math.PI/180;


        if(k===1)
        {
          FMCopy.position.z=-FMCopy.position.z;
        }

  			FMCopy.name = "feather_very_short"+k+i;
  			scene.add(FMCopy);
  		}
    }
    });

    // set camera position
    camera.position.set(0, 1, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));

    // scene.add(lambertCube);
    scene.add(directionalLight);

    // edit params and listen to changes like this
    // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
    gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
        camera.updateProjectionMatrix();
    });

    var update= new GUIoptions();
  // gui.add(update,'ColorLong', "0x2f2c31").onChange(function(newVal) {
  //   l=newVal;
  // });
  // gui.add(update,'ColorMedium', "0x231e1e").onChange(function(newVal) {
  //   m=newVal;
  // });
  // gui.add(update,'ColorShort', "0x191517").onChange(function(newVal) {
  //   s=newVal;
  // });
  gui.add(update,'FlappingSpeed', 0.1, 10.0, 1).onChange(function(newVal) {
    fs=newVal;
  });
  gui.add(update,'Amplitude', 0.1, 10.0, 1).onChange(function(newVal) {
    a=newVal;
  });
  gui.add(update,'Orientation', 0.0, 360.0, 1).onChange(function(newVal) {
    fo=newVal;
    toggle=!toggle;
  });
  // gui.add(update,'Scale', 0.1, 5.0, 0.01).onChange(function(newVal) {
  //   sc=newVal;
  // });
  gui.add(update,'Shape', 0.1, 10.0, 0.1).onChange(function(newVal) {
    sc=newVal;
  });
  gui.add(update,'WindSpeed', 10, 40, 1).onChange(function(newVal) {
    w=newVal;
  });
}

// called on frame updates
function onUpdate(framework) {
  // groundMirror = new THREE.Mirror( renderer, camera, { clipBias: 0.003, textureWidth: WIDTH, textureHeight: HEIGHT, color: 0x777777 } );
  // 				var mirrorMesh = new THREE.Mesh( planeGeo, groundMirror.material );
  // 				mirrorMesh.add( groundMirror );
  // 				mirrorMesh.rotateX( - Math.PI / 2 );
  // 				scene.add( mirrorMesh );
  if(toggle===true)
    fo=0.0;
  var date = new Date();
  var time=date.getTime()/50/(10.1-fs) %360;

  for(var k=0; k<2; k++)
  for(var i=0; i<31; i++)
	{
		var feather1 = framework.scene.getObjectByName("feather_long"+k+i);
		var feather2 = framework.scene.getObjectByName("feather_short"+k+i);
		var feather3 = framework.scene.getObjectByName("feather_very_short"+k+i);

		if (feather1 !== undefined) {
      var disp=(Math.sin((feather1.position.z/sc+time)% 360));
      feather1.position.y = feather1.position.z * disp / (10.1-a);
      feather1.rotateX(fo*Math.PI/180);
      feather1.position.x=(Math.sin(((feather1.position.x*feather1.position.z)*time)%360))/(51-w);
      //var feathermirror = framework.scene.getObjectByName("feather_long0"+i);
      //feather1.scale.addScalar(-1);
      if(k===1)
      {
        var feat = framework.scene.getObjectByName("feather_long0"+i);
        feather1.position.y=feat.position.y;
      }

		}
		if(feather2 !== undefined) {
      var disp=(Math.sin((feather2.position.z/sc+time)%360));
      feather2.position.y = feather2.position.z * disp / (10-a);
      feather2.rotateX(fo*Math.PI/180);
      feather2.position.x=(Math.sin(((feather2.position.x*feather2.position.z)*time)%360))/(51-w);
      //feather2.scale.addScalar(-1);
      if(k===1)
      {
        var feat = framework.scene.getObjectByName("feather_long0"+i);
        feather2.position.y=feat.position.y;
      }
		}
		if(feather3 !== undefined) {
      var disp=(Math.sin((feather3.position.z/sc+time)%360));
      feather3.position.y = feather3.position.z * disp / (10-a);
      feather3.rotateX(fo*Math.PI/180);
      feather3.position.x=(Math.sin(((feather3.position.x*feather3.position.z)*time)%360))/(51-w);
      //feather1.scale.addScalar(1);
      if(k===1)
      {
        var feat = framework.scene.getObjectByName("feather_long0"+i);
        feather3.position.y=feat.position.y;
      }
		}
	}
  toggle=true;
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
