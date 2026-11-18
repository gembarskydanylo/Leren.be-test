import bpy, math, os
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
root=os.path.dirname(os.path.abspath(__file__)); out=os.path.join(root,'assets')
def mat(name,c,rough=.65,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True;p=next((n for n in m.node_tree.nodes if n.bl_idname=='ShaderNodeBsdfPrincipled'),None) or m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal;return m
fur=mat('warm ginger',(0.8,.25,.045)); light=mat('cream muzzle',(1,.78,.53)); dark=mat('hoodie deep green',(.015,.12,.072)); rim=mat('glasses black',(.012,.017,.019),.25); eye=mat('iris green',(.12,.48,.06),.23); white=mat('eyes warm white',(.95,.9,.72),.2); nose=mat('nose pink',(.74,.27,.24)); gold=mat('laces yellow',(.99,.62,.03)); pad=mat('ear pink',(.64,.25,.19)); stripe=mat('ginger markings',(.44,.12,.025)); headphone=mat('headphones',(.028,.04,.05),.3,.3)
def ball(name,xyz,scale,material):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=20,location=xyz);o=bpy.context.object;o.name=name;o.scale=scale;o.data.materials.append(material);bpy.ops.object.shade_smooth();return o
def line(name,points,r,material):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=r;c.bevel_resolution=3;s=c.splines.new('POLY');s.points.add(len(points)-1)
 for p,co in zip(s.points,points):p.co=(*co,1)
 o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);o.data.materials.append(material);return o
def ring(name,x,z,rx,rz,y,material,r=.035):
 return line(name,[(x+rx*math.cos(i*2*math.pi/64),y,z+rz*math.sin(i*2*math.pi/64)) for i in range(65)],r,material)
def ear(name,x):
 verts=[(x-.43,-.05,2.72),(x+.43,-.05,2.72),(x,-.02,3.62),(x,-.44,2.87)];faces=[(0,1,2),(0,3,1),(1,3,2),(2,3,0)];mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);o.data.materials.append(fur);be=o.modifiers.new('soft edges','BEVEL');be.width=.1;be.segments=3;o.modifiers.new('weighted normals','WEIGHTED_NORMAL');ball('inner '+name,(x,-.31,3.02),(.22,.08,.34),pad)
ball('Body',(0,0,1),(.8,.55,.94),dark);ball('Hood',(0,.2,1.67),(.71,.44,.37),dark)
ball('Head',(0,0,2.55),(1.03,.72,.83),fur);ear('Ear.L',-.67);ear('Ear.R',.67)
for x in [-.44,.44]:
 ball('Eye white '+str(x),(x,-.63,2.68),(.36,.19,.34),white);ball('Iris '+str(x),(x,-.805,2.68),(.205,.082,.22),eye);ball('Pupil '+str(x),(x,-.874,2.68),(.082,.04,.14),rim);ball('Eye shine '+str(x),(x-.045,-.91,2.75),(.043,.02,.05),white);ring('Glasses '+str(x),x,2.68,.38,.35,-.9,rim,.04)
line('Glasses bridge',[(-.08,-.9,2.72),(0,-.94,2.78),(.08,-.9,2.72)],.035,rim)
for x in [-.25,.25]:ball('Muzzle '+str(x),(x,-.72,2.31),(.34,.27,.22),light)
ball('Jaw',(0,-.69,2.14),(.32,.18,.12),light);ball('Nose',(0,-.977,2.4),(.12,.08,.085),nose)
line('Mouth',[(0,-.992,2.34),(0,-.97,2.27),(-.15,-.957,2.30)],.014,rim);line('Mouth right',[(0,-.97,2.27),(.15,-.957,2.30)],.014,rim)
for side in [-1,1]:
 for i in range(3):line('Whisker',[(side*.33,-.92,2.31+i*.045),(side*.92,-.9,2.27+i*.1)],.009,white)
 ball('Arm '+str(side),(side*.7,-.06,1.13),(.3,.4,.48),dark);ball('Paw '+str(side),(side*.78,-.35,.83),(.23,.22,.21),fur)
 ball('Foot '+str(side),(side*.42,-.3,.26),(.32,.42,.2),fur)
 line('Lace '+str(side),[(side*.18,-.49,1.64),(side*.2,-.57,1.12)],.027,gold)
 ball('Headphone '+str(side),(side*.62,-.4,1.72),(.19,.13,.25),headphone);ball('Headphone centre '+str(side),(side*.62,-.515,1.72),(.12,.035,.16),rim)
line('Headphone band',[(-.58,-.35,1.78),(-.4,-.5,1.56),(0,-.57,1.49),(.4,-.5,1.56),(.58,-.35,1.78)],.06,headphone)
line('Tail',[(.55,.3,.55),(.95,.35,.45),(1.18,.32,.58),(1.22,.25,.9)],.14,fur)
for x in [-.27,0,.27]:line('Forehead stripe',[(x,-.55,3.09),(x*.75,-.62,3.18)],.025,stripe)
# Export only character geometry, not stage.
bpy.ops.object.select_all(action='SELECT');bpy.ops.export_scene.gltf(filepath=os.path.join(out,'lexi-prototype.glb'),export_format='GLB',use_selection=True)
world=bpy.context.scene.world;world.color=(.32,.32,.32)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,0));bpy.context.object.data.materials.append(mat('ground',(0.85,.82,.73)))
def area(loc,power,size):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,1.8))-o.location).to_track_quat('-Z','Y').to_euler()
area((3,-5,7),600,5);area((-4,-3,4),450,4);area((0,4,5),700,3)
bpy.ops.object.camera_add();cam=bpy.context.object;bpy.context.scene.camera=cam;cam.data.type='ORTHO';cam.data.ortho_scale=4.7
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.render.resolution_x=800;scene.render.resolution_y=800;scene.render.resolution_percentage=100
for name,loc in [('front',(0,-7,3.1)),('side',(7,-.01,3.1)),('angle',(5,-5,3.1))]:
 cam.location=loc;cam.rotation_euler=(Vector((0,0,1.85))-cam.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=os.path.join(out,name+'.png');bpy.ops.render.render(write_still=True)
