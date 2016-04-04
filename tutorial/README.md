# EɴᴛCʀᴀꜰᴛ :: ᴛᴜᴛᴏʀɪᴀʟ 

The TILED layer must be exported twice (as data & as image)

	**.json** 	: for collision generation with entcraft script

	**.png**	: for entity sprite

Now use **entcraft.js** to generate the Entity (.ent file).
> node entcraft.js layer.json

This will generate layer.ent (the entire layer treated as an entity, so the physics props
will be shared by each collision block.)

Copy the layer.ent and layer.png into the **/entities** directory of your Ethanon Proyect.
