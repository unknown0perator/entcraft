// ENTCRAFT : ᴄᴏᴍᴘᴏᴜɴᴅ ᴛɪʟᴇᴅ ᴇɴᴛɪᴛʏ ᴄʀᴀꜰᴛᴇʀ
//		Elliot Max. Lorenzo Megias

//--- LOAD .json
const args = process.argv;
const js0n = args[2];
var target = '';
//----- DISPLAY HELP MESSAGE
if(js0n == 'help' || js0n == '-h' || js0n == '-help'){ displayMsg(); }
else{
	var spl1t = js0n.split('.');
	if(spl1t[1] == 'json'){ 
		console.log(" ╔───╦═════════════════════════════════╗");
		console.log(" │ 0 ║   LOADING TILED EXPORTED JSON   ║");
		console.log(" ╚───╩═════════════════════════════════╝");
		console.log('   ~ target .json :: ' + args[2]); 
		target = spl1t[0];
		require('fs').unlink(target+'.emx', function (err) {
		    if (err){
		    	try { pj(JSON.parse(require('fs').readFileSync(args[2], 'utf8')), 0); }
				catch(e) {console.log(e + "\n"); }
		    } else {
				try { pj(JSON.parse(require('fs').readFileSync(args[2], 'utf8')), 1); }
				catch(e) {console.log(e + "\n"); }
			}
		});
	}
}
//--- PARSE .json
	function pj(f, o){
		console.log(" ╔───╦═════════════════════════════════╗");
		console.log(" │ 1 ║   PARSING TILED EXPORTED DATA   ║");
		console.log(" ╚───╩═════════════════════════════════╝");
		// CHECK LAYERS
		if(f.layers.length == 1 && f.tilesets.length == 1){
			// REQUIRED VARIABLES :
			var _imgW = f.tilesets[0].imagewidth;	var _imgH = f.tilesets[0].imageheight;	// ENTITY IMAGE DIMENSIONS (LAYER SIZE)
			var _tileW = f.tilesets[0].tilewidth;	var _tileH = f.tilesets[0].tileheight;	// LAYER TILE DIMENSIONS
			var _cols = f.layers[0].width;			var _rows = f.layers[0].height;			// LAYER DIMENSIONS
			var _layerData = f.layers[0].data;		
			//----------------------------------------------------------------------------------
			var _cwx = 1/_cols;		var ox = -1+_cwx;	var _cwxf = _cwx + (_cwx/2);	
			var _cwy = 1/_rows;		var oy = -1+_cwy;	var _cwyf = _cwy + (_cwy/2);
			// START THE MAGIC //---------------------------------------------------------------
			var usedBlocks = 0;		var ci=0;	var _compound = [];
			if(ci<=_layerData.length){
				for(var cy=oy; cy<=(1-_cwy); cy=cy+(_cwy*2)){
					//console.log(' @ ('+cy+' / '+(1-_cwy)+')');
					for(var cx=ox; cx<=(1-_cwx); cx=cx+(_cwx*2)){
						var _ctile = _layerData[ci];
						if(_ctile!=0){
							var boxName = 'box'+usedBlocks;
							var _cbox =  boxName+'\n{\nshape = box;\nsizeX = '+_cwxf+';\nsizeY = '+_cwyf+';\nposX = '+cx+';\nposY = '+cy+';\nangle = 0;\n}\n';
							usedBlocks++;
							_compound.push(_cbox);
						}
						ci++;
					}
				}
			}
			// ENTITY EXPORTER //---------------------------------------------------------------
			entexp(_compound, (_tileW*_cols), (_tileH*_rows));
			//----------------------------------------------------------------------------------
		}else{ //JSON DATA ERRORS :
			console.log(" [!] ERROR : .json data ");
			if(f.layers.length > 1){console.log("   .json must contain only 1 layer.\n   target .json layers = "+f.layers.length);}
			if(f.tilesets.length > 1){console.log("   .json must contain only 1 tileset.\n   target .json tilesets = "+f.tilesets.length);}
		}
	}
//--- COMPOUND ENTITY EXPORTER
	function entexp(ctiles, iw, ih){
		// ENTITY PROPS :
		console.log(" ╔───╦═════════════════════════════════╗");
		console.log(" │ 2 ║    SETTING ENTITY PROPERTIES    ║");
		console.log(" ╚───╩═════════════════════════════════╝");
		try{
			var c0nf = JSON.parse(require('fs').readFileSync('entcraft.conf', 'utf8'));
			var _friction = c0nf.friction;
			var _density = c0nf.density;
			var _restitution = c0nf.restitution;
			var _applyLight = c0nf.applyLight;
			console.log("   ~ values loaded : entcraft.conf ");
		}catch(e){
			var _friction = 1;		var _density = 1;
			var _restitution = 0;	var _applyLight = 0;
			console.log("  "+e);
			console.log("   ~ using default values instead :");
		}
		var _sprite = target+'.png';
		console.log("     ·    ꜰʀɪᴄᴛɪᴏɴ : "+_friction);
		console.log("     ·     ᴅᴇɴꜱɪᴛʏ : "+_density);
		console.log("     · ʀᴇꜱᴛɪᴛᴜᴛɪᴏɴ : "+_restitution);
		console.log("     · ᴀᴘᴘʟʏ ʟɪɢʜᴛ : "+_applyLight);
		console.log("     ·     ꜱᴘʀɪᴛᴇ  : "+_sprite); 
		var ent_header = '<?xml version="1.0" ?>\n<Ethanon>\n    <Entity shape="4" sensor="0" bullet="0" fixedRotation="1" friction="'+_friction+'" density="'+_density+'" restitution="'+_restitution+'" gravityScale="1" applyLight="'+_applyLight+'" castShadow="0" type="0" static="1" blendMode="0">\n        <Sprite>'+_sprite+'</Sprite>\n        <Particles />\n       <Collision>\n         <Position x="0" y="0" z="0" />\n         <Size x="'+iw+'" y="'+ih+'" z="0" />\n         <Compound>\n<![CDATA[';
		require('fs').appendFile(target+'.ent', ent_header, function (err) {});
        // COLLISION : COMPOUND TILES
       	console.log(" ╔───╦═════════════════════════════════╗");
		console.log(" │ 3 ║    SETTING ENTITY COLLISIONS    ║");
		console.log(" ╚───╩═════════════════════════════════╝");
        for(var cb=0; cb<ctiles.length; cb++){require('fs').appendFile(target+'.ent', ctiles[cb], function (err) {});}
        // END OF .ent FILE
    	console.log(" ╔───╦═════════════════════════════════╗");
		console.log(" │ X ║      EXPORTING ENTITY FILE      ║");
		console.log(" ╚───╩═════════════════════════════════╝");
        var ent_footer = ']]>\n         </Compound>\n       </Collision>\n       <CustomData />\n    </Entity>\n</Ethanon>';
		require('fs').appendFile(target+'.ent', ent_footer, function (err) {
			console.log("   ~ entity saved as :: "+target+'.ent');
		});

	}

	
//--
function displayMsg(){
	console.log("   ╔═════════════════════════════════╗  ");
	console.log("   ║       ~ ETHANON  ENGINE ~       ║  ")
	console.log("   ║  ᴄᴏᴍᴘᴏᴜɴᴅ ᴛɪʟᴇᴅ ᴇɴᴛɪᴛʏ ᴄʀᴀꜰᴛᴇʀ  ║  ");
	console.log("   ╚═════════════════════════════════╝  ");
	console.log(" ╔───╦═════════════════════════════════╗");
	console.log(" │ > ║   Elliot Max. Lorenzo Megias    ║");
	console.log(" ╠───╝                                 ║");
	console.log(" ╚═════════════════════════════════════╝");
	console.log(" ╔───╦═════════════════════════════════╗");
	console.log(" │ ? ║   # ᴄᴏɴᴠᴇʀᴛ .json > .ent        ║");
	console.log(" ╠───╝   node entcraft layer.json      ║");
	console.log(" ╚═════════════════════════════════════╝");
}