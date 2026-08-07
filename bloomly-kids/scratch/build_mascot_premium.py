import bpy
import math

# 1. Clear default objects
for obj in bpy.data.objects:
    bpy.data.objects.remove(obj, do_unlink=True)

# 2. Set frame range (0 to 60 for 2-second loop at 30fps)
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = 60

# 3. Helper function to create materials with clay/clearcoat shader
def create_clay_material(name, color_rgba, roughness=0.5, clearcoat=0.8):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    principled = nodes.get("Principled BSDF")
    
    # Base Color
    principled.inputs['Base Color'].default_value = color_rgba
    # Roughness
    principled.inputs['Roughness'].default_value = roughness
    
    # Clearcoat (Shiny lacquer on top of flat layers for a premium vinyl sticker look!)
    if 'Coat Weight' in principled.inputs:
        principled.inputs['Coat Weight'].default_value = clearcoat
        principled.inputs['Coat Roughness'].default_value = 0.15
    elif 'Clearcoat' in principled.inputs:
        principled.inputs['Clearcoat'].default_value = clearcoat
        principled.inputs['Clearcoat Roughness'].default_value = 0.15
        
    return mat

mat_red = create_clay_material("Apple_Red", (1.0, 0.08, 0.08, 1.0), roughness=0.45, clearcoat=0.8) # Pixar glossy red
mat_white = create_clay_material("Glove_White", (1.0, 1.0, 1.0, 1.0), roughness=0.4, clearcoat=0.2)
mat_black = create_clay_material("Limb_Black", (0.1, 0.1, 0.1, 1.0), roughness=0.6)
mat_brown = create_clay_material("Stem_Brown", (0.32, 0.18, 0.1, 1.0), roughness=0.7)
mat_green = create_clay_material("Leaf_Green", (0.28, 0.78, 0.1, 1.0), roughness=0.6)
mat_pink = create_clay_material("Tongue_Pink", (1.0, 0.45, 0.55, 1.0), roughness=0.5)

# Parent helper to fix parent-offset bug (keeps world transform)
def parent_object(child, parent):
    bpy.context.view_layer.update()
    child.parent = parent
    child.matrix_parent_inverse = parent.matrix_world.inverted()

# 4. Create Apple Body (Flat in XY plane, deformed locally, then rotated)
bpy.ops.mesh.primitive_circle_add(vertices=128, radius=0.72, fill_type='NGON', location=(0, 0, 0))
apple = bpy.context.active_object
apple.name = "Apple_Body"
apple.scale = (1.05, 1.05, 1.0)
apple.data.materials.append(mat_red)

# Shape deformation in local XY plane (where Y is height, X is width)
mesh = apple.data
for v in mesh.vertices:
    lx = v.co.x
    ly = v.co.y
    h_dist = abs(lx)
    
    # 1. Taper bottom, expand top lobes
    if ly < 0:
        factor = 1.0 + ly * 0.32
        v.co.x *= factor
    else:
        factor = 1.0 + ly * 0.12
        v.co.x *= factor
        
    # 2. Smooth Cleft at the top center
    if ly > 0.25:
        v.co.y -= (0.75 - h_dist) * 0.18

bpy.ops.object.shade_smooth()

# 5. Create Face Elements in local XY plane (Z is local depth / thickness)
# Eyes
bpy.ops.mesh.primitive_circle_add(vertices=62, radius=0.15, fill_type='NGON', location=(-0.11, 0.15, 0.02))
left_eye = bpy.context.active_object
left_eye.name = "Eye_Left"
left_eye.scale = (0.85, 1.25, 1.0)
left_eye.data.materials.append(mat_white)
bpy.ops.object.shade_smooth()

bpy.ops.mesh.primitive_circle_add(vertices=32, radius=0.075, location=(-0.08, 0.15, 0.03))
left_pupil = bpy.context.active_object
left_pupil.name = "Pupil_Left"
left_pupil.scale = (0.85, 1.25, 1.0)
left_pupil.data.materials.append(mat_black)
bpy.ops.object.shade_smooth()

bpy.ops.mesh.primitive_circle_add(vertices=16, radius=0.024, location=(-0.06, 0.21, 0.04))
left_shine = bpy.context.active_object
left_shine.name = "Shine_Left"
left_shine.data.materials.append(mat_white)
bpy.ops.object.shade_smooth()

bpy.ops.mesh.primitive_circle_add(vertices=62, radius=0.15, fill_type='NGON', location=(0.11, 0.15, 0.02))
right_eye = bpy.context.active_object
right_eye.name = "Eye_Right"
right_eye.scale = (0.85, 1.25, 1.0)
right_eye.data.materials.append(mat_white)
bpy.ops.object.shade_smooth()

bpy.ops.mesh.primitive_circle_add(vertices=32, radius=0.075, location=(0.08, 0.15, 0.03))
right_pupil = bpy.context.active_object
right_pupil.name = "Pupil_Right"
right_pupil.scale = (0.85, 1.25, 1.0)
right_pupil.data.materials.append(mat_black)
bpy.ops.object.shade_smooth()

bpy.ops.mesh.primitive_circle_add(vertices=16, radius=0.024, location=(0.10, 0.21, 0.04))
right_shine = bpy.context.active_object
right_shine.name = "Shine_Right"
right_shine.data.materials.append(mat_white)
bpy.ops.object.shade_smooth()

parent_object(left_eye, apple)
parent_object(left_pupil, apple)
parent_object(left_shine, apple)
parent_object(right_eye, apple)
parent_object(right_pupil, apple)
parent_object(right_shine, apple)

# Nose (Small red circle)
bpy.ops.mesh.primitive_circle_add(vertices=32, radius=0.045, location=(0, 0.0, 0.02))
nose = bpy.context.active_object
nose.name = "Nose"
nose.data.materials.append(mat_red)
bpy.ops.object.shade_smooth()
parent_object(nose, apple)

# D-Shaped Smiling Mouth
bpy.ops.mesh.primitive_circle_add(vertices=32, radius=0.14, fill_type='NGON', location=(0, -0.18, 0.02))
mouth = bpy.context.active_object
mouth.name = "Mouth_Smile"
mouth.data.materials.append(mat_black)

# Flatten the top half of the mouth (where Y > 0 in local XY plane!)
for v in mouth.data.vertices:
    if v.co.y > 0:
        v.co.y = 0.0
bpy.ops.object.shade_smooth()
parent_object(mouth, apple)

# Tooth (White rectangle at top of D-shape mouth)
bpy.ops.mesh.primitive_circle_add(vertices=16, radius=0.04, fill_type='NGON', location=(0, -0.12, 0.03))
tooth = bpy.context.active_object
tooth.name = "Tooth"
tooth.scale = (2.2, 0.35, 1.0)
tooth.data.materials.append(mat_white)
for v in tooth.data.vertices:
    if v.co.y < 0:
        v.co.y = 0.0
bpy.ops.object.shade_smooth()
parent_object(tooth, apple)

# Pink Tongue
bpy.ops.mesh.primitive_circle_add(vertices=16, radius=0.05, fill_type='NGON', location=(0, -0.22, 0.03))
tongue = bpy.context.active_object
tongue.name = "Tongue"
tongue.scale = (1.2, 0.6, 1.0)
tongue.data.materials.append(mat_pink)
bpy.ops.object.shade_smooth()
parent_object(tongue, apple)

# 6. Happy Curved Eyebrows (Using Bezier Curves for thin elegant happy arcs)
def create_local_eyebrow(name, start, middle, end, bevel_depth=0.008):
    curve_data = bpy.data.curves.new(name + '_Data', type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.bevel_depth = bevel_depth
    curve_data.bevel_resolution = 4
    
    spline = curve_data.splines.new('BEZIER')
    spline.bezier_points.add(2)
    
    spline.bezier_points[0].co = start
    spline.bezier_points[0].handle_left_type = 'AUTO'
    spline.bezier_points[0].handle_right_type = 'AUTO'
    
    spline.bezier_points[1].co = middle
    spline.bezier_points[1].handle_left_type = 'AUTO'
    spline.bezier_points[1].handle_right_type = 'AUTO'
    
    spline.bezier_points[2].co = end
    spline.bezier_points[2].handle_left_type = 'AUTO'
    spline.bezier_points[2].handle_right_type = 'AUTO'
    
    obj = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(obj)
    
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target='MESH')
    
    mesh_obj = bpy.context.active_object
    mesh_obj.data.materials.append(mat_black)
    bpy.ops.object.shade_smooth()
    return mesh_obj

# Create eyebrows in local space (Y is vertical, Z is depth)
eyebrow_l = create_local_eyebrow("Eyebrow_L", (-0.19, 0.28, 0.02), (-0.12, 0.34, 0.02), (-0.05, 0.28, 0.02))
eyebrow_r = create_local_eyebrow("Eyebrow_R", (0.05, 0.28, 0.02), (0.12, 0.34, 0.02), (0.19, 0.28, 0.02))
parent_object(eyebrow_l, apple)
parent_object(eyebrow_r, apple)


# 7. Parent Face, then ROTATE and POSITION the parent apple body!
# This resolves all local rotation and projection errors!
apple.rotation_euler = (math.radians(90), 0, 0)
apple.location = (0, 0, 1.0)
bpy.context.view_layer.update()


# 8. Stem & Leaf (Centered perfectly in cleft, parented to apple body)
bpy.ops.mesh.primitive_cylinder_add(radius=0.035, depth=0.28, location=(0, 0.02, 1.58))
stem = bpy.context.active_object
stem.name = "Stem"
stem.rotation_euler = (0, 0.18, 0)
stem.data.materials.append(mat_brown)
bpy.ops.object.shade_smooth()
parent_object(stem, apple)

# Leaf (Green flat leaf)
bpy.ops.mesh.primitive_circle_add(vertices=32, radius=0.14, fill_type='NGON', location=(0.09, 0.03, 1.68), rotation=(math.radians(90), 0, 0))
leaf = bpy.context.active_object
leaf.name = "Leaf"
leaf.scale = (1.4, 0.2, 0.7)
leaf.rotation_euler = (0.2, 0.5, -0.5)
leaf.data.materials.append(mat_green)
bpy.ops.object.shade_smooth()
parent_object(leaf, apple)


# 9. ORGANIC CURVED ARMS (Thin and smooth curves)
def create_curved_arm_mesh(name, start, middle, end, bevel_depth=0.02):
    curve_data = bpy.data.curves.new(name + '_Data', type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.bevel_depth = bevel_depth
    curve_data.bevel_resolution = 6
    
    spline = curve_data.splines.new('BEZIER')
    spline.bezier_points.add(2)
    
    p0 = spline.bezier_points[0]
    p0.co = start
    p0.handle_left_type = 'AUTO'
    p0.handle_right_type = 'AUTO'
    
    p1 = spline.bezier_points[1]
    p1.co = middle
    p1.handle_left_type = 'AUTO'
    p1.handle_right_type = 'AUTO'
    
    p2 = spline.bezier_points[2]
    p2.co = end
    p2.handle_left_type = 'AUTO'
    p2.handle_right_type = 'AUTO'
    
    obj = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(obj)
    
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target='MESH')
    
    arm_mesh = bpy.context.active_object
    arm_mesh.data.materials.append(mat_black)
    bpy.ops.object.shade_smooth()
    return arm_mesh

# Left Arm (Curves gently downward to rest hand near hip)
left_arm = create_curved_arm_mesh(
    "Left_Arm", 
    start=(-0.52, 0, 0.85), 
    middle=(-0.72, 0, 0.70), 
    end=(-0.76, -0.05, 0.55)
)
parent_object(left_arm, apple)

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, location=(-0.76, -0.05, 0.50))
left_glove = bpy.context.active_object
left_glove.name = "Left_Glove"
left_glove.data.materials.append(mat_white)
bpy.ops.object.shade_smooth()
parent_object(left_glove, apple)


# Right Arm Group (Pivot at shoulder joint: Y is aligned)
bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0.52, 0, 0.9))
right_arm_pivot = bpy.context.active_object
right_arm_pivot.name = "Right_Arm_Pivot"
parent_object(right_arm_pivot, apple)

# Right Waving Arm (Smooth curve raised up-right)
right_arm = create_curved_arm_mesh(
    "Right_Arm", 
    start=(0, 0, 0), 
    middle=(0.16, 0, 0.18), 
    end=(0.30, 0, 0.36)
)
parent_object(right_arm, right_arm_pivot)

# Right Glove palm sphere
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, location=(0.30, 0, 0.36))
right_glove = bpy.context.active_object
right_glove.name = "Right_Glove"
right_glove.data.materials.append(mat_white)
bpy.ops.object.shade_smooth()
parent_object(right_glove, right_arm_pivot)

# Add 4 fingers to the right glove splayed open
finger_angles = [-0.4, -0.15, 0.15, 0.4]
finger_offsets_x = [-0.035, -0.012, 0.012, 0.035]
for i in range(4):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.016, depth=0.06, location=(0.30 + finger_offsets_x[i], 0, 0.40))
    finger = bpy.context.active_object
    finger.name = f"Right_Finger_{i}"
    finger.rotation_euler = (0, finger_angles[i], 0)
    finger.data.materials.append(mat_white)
    bpy.ops.object.shade_smooth()
    parent_object(finger, right_arm_pivot)


# 10. Legs and Shoes (Boots matching reference style)
# Left Leg
bpy.ops.mesh.primitive_cylinder_add(radius=0.032, depth=0.35, location=(-0.18, 0.02, 0.22))
left_leg = bpy.context.active_object
left_leg.name = "Left_Leg"
left_leg.data.materials.append(mat_black)
bpy.ops.object.shade_smooth()
parent_object(left_leg, apple)

# Left Shoe (Boots)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.09, location=(-0.20, -0.05, 0.08))
left_shoe = bpy.context.active_object
left_shoe.name = "Left_Shoe"
left_shoe.scale = (1.4, 0.8, 1)
left_shoe.data.materials.append(mat_brown)
bpy.ops.object.shade_smooth()
parent_object(left_shoe, apple)

# Right Leg
bpy.ops.mesh.primitive_cylinder_add(radius=0.032, depth=0.35, location=(0.18, 0.02, 0.22))
right_leg = bpy.context.active_object
right_leg.name = "Right_Leg"
right_leg.data.materials.append(mat_black)
bpy.ops.object.shade_smooth()
parent_object(right_leg, apple)

# Right Shoe (Boots)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.09, location=(0.20, -0.05, 0.08))
right_shoe = bpy.context.active_object
right_shoe.name = "Right_Shoe"
right_shoe.scale = (1.4, 0.8, 1)
right_shoe.data.materials.append(mat_brown)
bpy.ops.object.shade_smooth()
parent_object(right_shoe, apple)


# 11. Lighting Setup (Camera and Lights)
# Studio Point Light
bpy.ops.object.light_add(type='POINT', radius=1.0, location=(2.0, -3.0, 3.0))
light = bpy.context.active_object
light.name = "Studio_Light"
light.data.energy = 500

# Back/Rim Light
bpy.ops.object.light_add(type='POINT', radius=1.0, location=(-2.0, 2.0, 3.0))
light_back = bpy.context.active_object
light_back.name = "Rim_Light"
light_back.data.energy = 300

# Camera (Perfect front alignment)
bpy.ops.object.camera_add(location=(0, -3.4, 1.05), rotation=(math.radians(85), 0, 0))
camera = bpy.context.active_object
camera.name = "Camera"
bpy.context.scene.camera = camera


# 12. ANIMATION KEYFRAMING (Ultra-smooth waving loop)
for f in range(1, 61):
    bpy.context.scene.frame_set(f)
    
    # Breathing Squash & Stretch on Apple_Body (Face, stem, limbs scale dynamically with it!)
    breathe = math.sin(f * (2 * math.pi / 28))
    apple.scale = (1.05 - breathe * 0.012, 1.0, 1.0 + breathe * 0.02)
    apple.location.z = 1.0 + breathe * 0.012
    apple.keyframe_insert(data_path="scale", index=-1)
    apple.keyframe_insert(data_path="location", index=-1)
    
    # Waving Right Arm (Gentle, organic wave loop)
    wave = math.sin(f * (2 * math.pi / 15))
    right_arm_pivot.rotation_euler.y = wave * 0.28
    right_arm_pivot.keyframe_insert(data_path="rotation_euler", index=-1)
    
    # Blinking (Blink eye Z scale)
    if (25 <= f <= 30) or (50 <= f <= 55):
        peak = 27 if (25 <= f <= 30) else 52
        dist = abs(f - peak)
        scale_z = 0.1 + (dist / 3.0) * 0.9
    else:
        scale_z = 1.0
        
    left_eye.scale.z = scale_z * 1.25
    right_eye.scale.z = scale_z * 1.25
    left_eye.keyframe_insert(data_path="scale", index=-1)
    right_eye.keyframe_insert(data_path="scale", index=-1)

# Reset frame to 1
bpy.context.scene.frame_set(1)

# Save file
blend_file_path = "c:\\Users\\omar\\Desktop\\Huda-Nour-Site\\bloomly-kids\\apple_mascot_animated.blend"
bpy.ops.wm.save_as_mainfile(filepath=blend_file_path)
print("SUCCESS: Perfect 2.5D apple mascot generated and saved to: " + blend_file_path)
