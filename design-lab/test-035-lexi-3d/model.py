import bpy, math, os, json, random
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
# A single sculpted surface for skull, eye surrounds, cheeks and muzzle.
# Smooth analytic deformations keep the head cohesive; anatomy still needs an artist's sculpt.
verts=[];faces=[];u_count=96;v_count=48
for j in range(v_count+1):
 lat=-math.pi/2+math.pi*j/v_count
 for i in range(u_count):
  lon=2*math.pi*i/u_count; x=math.cos(lat)*math.cos(lon); y=math.cos(lat)*math.sin(lon); z=math.sin(lat)
  cheek=max(0,1-abs(z+.23)*2); X=x*(.88+.18*cheek); Z=2.56+z*.78; Y=y*.69
  if y<0:
   front=(-y)**4
   socket=sum(math.exp(-(((X-c)/.35)**2+((Z-2.68)/.31)**2)*1.8) for c in (-.43,.43))
   muzzle=math.exp(-((X/.48)**2+((Z-2.32)/.27)**2)*1.4)
   cheeks=sum(math.exp(-(((X-c)/.34)**2+((Z-2.32)/.29)**2)*1.5) for c in (-.58,.58))
   Y+=front*(.13*socket-.17*muzzle-.085*cheeks)
  verts.append((X,Y,Z))
for j in range(v_count):
 for i in range(u_count):
  k=j*u_count+i;n=j*u_count+(i+1)%u_count;faces.append((k,n,n+u_count,k+u_count))
mesh=bpy.data.meshes.new('Sculpted head topology');mesh.from_pydata(verts,[],faces);mesh.update();head=bpy.data.objects.new('Sculpted head',mesh);bpy.context.collection.objects.link(head);head.data.materials.append(fur)
for face in mesh.polygons:face.use_smooth=True
# Mesh vertex colors give the WebGL export a subtle tabby / muzzle color treatment.
col=mesh.color_attributes.new(name='FurColor',type='BYTE_COLOR',domain='CORNER')
for poly in mesh.polygons:
 for li in poly.loop_indices:
  v=mesh.vertices[mesh.loops[li].vertex_index].co;x,y,z=v.x,v.y,v.z
  base=(.78,.245,.048,1);cream=(.98,.76,.52,1)
  weight=max(0,min(1,(2.49-z)*7))*max(0,min(1,(-y-.25)*4))
  col.data[li].color=tuple(base[k]*(1-weight)+cream[k]*weight for k in range(4))
# Dedicated material nodes ensure vertex color survives glTF; keep source materials editable.
fur_head=fur.copy();fur_head.name='Head fur vertex colors';nodes=fur_head.node_tree.nodes;principled=next(n for n in nodes if n.bl_idname=='ShaderNodeBsdfPrincipled');vc=nodes.new('ShaderNodeVertexColor');vc.layer_name='FurColor';fur_head.node_tree.links.new(vc.outputs['Color'],principled.inputs['Base Color']);head.data.materials.clear();head.data.materials.append(fur_head)
ear('Ear.L',-.67);ear('Ear.R',.67)
# Thin tapered layered tufts, kept as individual pieces for later art direction.
for side in [-1,1]:
 for i in range(5):
  z=2.17+i*.13;x=side*(.83+.05*math.sin(i*math.pi/4)); y=-.27
  v=[(x,y,z-.10),(x,y-.06,z+.08),(x+side*.19,y+.05,z+.03),(x+side*.10,y+.025,z-.045)]
  me=bpy.data.meshes.new('Fur tuft');me.from_pydata(v,[],[(0,1,2,3)]);me.update();o=bpy.data.objects.new('Cheek fur',me);bpy.context.collection.objects.link(o);o.data.materials.append(fur)
  sol=o.modifiers.new('Thickness','SOLIDIFY');sol.thickness=.018;be=o.modifiers.new('Soft edges','BEVEL');be.width=.025;be.segments=3
# Separate movable ocular elements with reduced depth and inset placement.
for x in [-.43,.43]:
 ball('Eye white '+str(x),(x,-.56,2.68),(.32,.085,.30),white)
 ball('Iris '+str(x),(x,-.636,2.68),(.19,.035,.205),eye)
 ball('Pupil '+str(x),(x,-.667,2.68),(.082,.018,.14),rim)
 ball('Eye shine '+str(x),(x-.045,-.69,2.75),(.037,.012,.045),white)
 ring('Glasses '+str(x),x,2.68,.35,.31,-.73,rim,.033)
line('Glasses bridge',[(-.08,-.73,2.72),(0,-.755,2.76),(.08,-.73,2.72)],.027,rim)
for side in [-1,1]:
 line('Eyebrow',[(side*.22,-.63,3.015),(side*.42,-.68,3.09),(side*.62,-.61,3.02)],.027,stripe)
# Nose is a bevelled triangular form; smile remains a separate curve for future rigging.
nv=[(-.115,-.84,2.405),(.115,-.84,2.405),(0,-.88,2.32),(-.09,-.73,2.41),(.09,-.73,2.41),(0,-.76,2.33)]
nm=bpy.data.meshes.new('Nose');nm.from_pydata(nv,[],[(0,1,2),(3,5,4),(0,3,4,1),(1,4,5,2),(2,5,3,0)]);nm.update();no=bpy.data.objects.new('Nose',nm);bpy.context.collection.objects.link(no);no.data.materials.append(nose);be=no.modifiers.new('Soft nose','BEVEL');be.width=.035;be.segments=3;no.modifiers.new('Normals','WEIGHTED_NORMAL')
line('Smile',[(0,-.835,2.32),(0,-.824,2.25),(-.10,-.80,2.22),(-.19,-.76,2.27)],.012,rim)
line('Smile right',[(0,-.824,2.25),(.10,-.80,2.22),(.19,-.76,2.27)],.012,rim)
for side in [-1,1]:
 for i in range(3):line('Whisker',[(side*.32,-.77,2.31+i*.045),(side*.94,-.69,2.27+i*.1)],.009,white)
 ball('Arm '+str(side),(side*.7,-.06,1.13),(.3,.4,.48),dark);ball('Paw '+str(side),(side*.78,-.35,.83),(.23,.22,.21),fur)
 ball('Foot '+str(side),(side*.42,-.3,.26),(.32,.42,.2),fur)
 line('Lace '+str(side),[(side*.18,-.49,1.64),(side*.2,-.57,1.12)],.027,gold)
 ball('Headphone '+str(side),(side*.62,-.4,1.72),(.19,.13,.25),headphone);ball('Headphone centre '+str(side),(side*.62,-.515,1.72),(.12,.035,.16),rim)
line('Headphone band',[(-.58,-.35,1.78),(-.4,-.5,1.56),(0,-.57,1.49),(.4,-.5,1.56),(.58,-.35,1.78)],.06,headphone)
tail=bpy.data.curves.new('Tail sculpt','CURVE');tail.dimensions='3D';tail.bevel_depth=.15;tail.bevel_resolution=4;tail.use_fill_caps=True;tail.resolution_u=16
sp=tail.splines.new('BEZIER');sp.bezier_points.add(3)
for point,co in zip(sp.bezier_points,[(.54,.3,.55),(.95,.35,.39),(1.3,.32,.57),(1.2,.25,1.05)]):point.co=co;point.handle_left_type='AUTO';point.handle_right_type='AUTO'
o=bpy.data.objects.new('Tail sculpt',tail);bpy.context.collection.objects.link(o);o.data.materials.append(fur)
for side in [-1,1]:
 for j in range(3):
  x=side*.78+(j-1)*.085;ball('Paw digit',(x,-.51,.88),(.055,.052,.072),fur)
# Embroidered label and cloth seam use geometry rather than a remote texture.
bpy.ops.object.text_add(location=(-.29,-.555,1.04),rotation=(math.pi/2,0,0));o=bpy.context.object;o.name='LerenBe embroidery';o.data.body='LerenBe';o.data.size=.13;o.data.extrude=.001;o.data.materials.append(white)
line('Hood seam',[(-.5,-.37,1.47),(-.3,-.49,1.33),(0,-.55,1.29),(.3,-.49,1.33),(.5,-.37,1.47)],.012,headphone)

for x in [-.27,0,.27]:line('Forehead stripe',[(x,-.55,3.09),(x*.75,-.62,3.18)],.025,stripe)
# Export only character geometry, not stage.
bpy.ops.object.select_all(action='SELECT')
deps=bpy.context.evaluated_depsgraph_get();tris=0
for obj in bpy.context.selected_objects:
 if obj.type in {'MESH','CURVE','FONT'}:
  ev=obj.evaluated_get(deps);mesh=ev.to_mesh();mesh.calc_loop_triangles();tris+=len(mesh.loop_triangles);ev.to_mesh_clear()
bpy.ops.export_scene.gltf(filepath=os.path.join(out,'lexi-prototype.glb'),export_format='GLB',use_selection=True)
with open(os.path.join(out,'model-metrics.json'),'w') as f:json.dump({'triangles_evaluated_blender':tris,'glb_bytes':os.path.getsize(os.path.join(out,'lexi-prototype.glb'))},f,indent=2)
world=bpy.context.scene.world;world.color=(.32,.32,.32)
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,0));bpy.context.object.data.materials.append(mat('ground',(0.85,.82,.73)))
def area(loc,power,size):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,1.8))-o.location).to_track_quat('-Z','Y').to_euler()
area((3,-5,7),600,5);area((-4,-3,4),450,4);area((0,4,5),700,3)
bpy.ops.object.camera_add();cam=bpy.context.object;bpy.context.scene.camera=cam;cam.data.type='ORTHO';cam.data.ortho_scale=4.7
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.render.resolution_x=800;scene.render.resolution_y=800;scene.render.resolution_percentage=100
for name,loc in [('front',(0,-7,3.1)),('side',(7,-.01,3.1)),('angle',(5,-5,3.1)),('face',(0,-7,2.65))]:
 cam.data.ortho_scale=2.8 if name=='face' else 4.7;target=Vector((0,0,2.58)) if name=='face' else Vector((0,0,1.85));cam.location=loc;cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=os.path.join(out,name+'.png');bpy.ops.render.render(write_still=True)
