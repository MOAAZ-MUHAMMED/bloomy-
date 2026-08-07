import bpy
import math

# 1. Clear default objects
for obj in bpy.data.objects:
    bpy.data.objects.remove(obj, do_unlink=True)

# 2. Set frame range (0 to 60 for 2-second loop at 30fps)
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = 60

# 3. Helper function to create materials with clay shader
def create_clay_material(name, color_rgba, roughness=0.5, clearcoat=0.8):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    principled = nodes.get("Principled BSDF")
    
    # Base Color
    principled.inputs['Base Color'].default_value = color_rgba
    # Roughness
    principled.inputs['Roughness'].default_value = roughness
    
    # Clearcoat (Shiny lacquer on top of clay)
    # Check for Blender 4.0+ new BSDF inputs
    if 'Coat Weight' in principled.inputs:
        principled.inputs['Coat Weight'].default_value = clearcoat
        principled.inputs['Coat Roughness'].default_value = 0.15
    elif 'Clearcoat' in principled.inputs:
        principled.inputs['Clearcoat'].default_value = clearcoat
        principled.inputs['Clearcoat Roughness'].default_value = 0.15
        
    return mat

mat_red = create_clay_material("Apple_Red", (1.0, 0.22, 0.22, 1.0), roughness=0.5, clearcoat=0.7)
mat_white = create_clay_material("Glove_White", (1.0, 1.0, 1.0, 1.0), roughness=0.4, clearcoat=0.2)
mat_black = create_clay_material("Limb_Black", (0.13, 0.13, 0.13, 1.0), roughness=0.6)
mat_brown = create_clay_material("Stem_Brown", (0.36, 0.25, 0.22, 1.0), roughness=0.7)
mat_green = create_clay_material("Leaf_Green", (0.38, 0.74, 0.16, 1.0), roughness=0.6)

# 4. Create Deformed Apple Body
bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=64, radius=0.9, location=(0, 0, 1.0))
apple = bpy.context.active_object
apple.name = "Apple_Body"
apple.data.materials.append(mat_red)

# Shape deformation for apple lobes
mesh = apple.data
for v in mesh.vertices:
    x, y, z = v.co.x, v.co.y, v.co.z - 1.0
    r = math.sqrt(x*x + y*y + z*z)
    if r > 0:
        nx, ny, nz = x/r, y/r, z/r
        # Indentations
        if nz > 0:
            r -= nz*nz * 0.16
        else:
            r -= nz*nz * 0.12
        v.co.x = nx * r
        v.co.y = ny * r
        v.co.z = nz * r + 1.0

bpy.ops.object.shade_smooth()

# 5. Create Eyes (White eyeballs + Black pupils)
# Left Eye
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.18, location=(-0.16, -0.85, 1.15))
left_eye = bpy.context.active_object
left_eye.name = "Eye_Left"
left_eye.scale = (0.8, 0.4, 1.2)
left_eye.data.materials.append(mat_white)
bpy.ops.object.shade_smooth()

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, location=(-0.13, -0.92, 1.15))
left_pupil = bpy.context.active_object
left_pupil.name = "Pupil_Left"
left_pupil.scale = (0.8, 0.4, 1.2)
left_pupil.data.materials.append(mat_black)
bpy.ops.object.shade_smooth()

# Right Eye
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.18, location=(0.16, -0.85, 1.15))
right_eye = bpy.context.active_object
right_eye.name = "Eye_Right"
right_eye.scale = (0.8, 0.4, 1.2)
right_eye.data.materials.append(mat_white)
bpy.ops.object.shade_smooth()

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, location=(0.13, -0.92, 1.15))
right_pupil = bpy.context.active_object
right_pupil.name = "Pupil_Right"
right_pupil.scale = (0.8, 0.4, 1.2)
right_pupil.data.materials.append(mat_black)
bpy.ops.object.shade_smooth()

# Parent eyes to body
left_eye.parent = apple
left_pupil.parent = apple
right_eye.parent = apple
right_pupil.parent = apple

# 6. Create Mouth
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, location=(0, -0.85, 0.8))
mouth = bpy.context.active_object
mouth.name = "Mouth"
mouth.scale = (1.2, 0.3, 0.6)
mouth.data.materials.append(mat_black)
bpy.ops.object.shade_smooth()
mouth.parent = apple

# 7. Stem & Leaf
bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=0.35, location=(0, 0, 1.85))
stem = bpy.context.active_object
stem.name = "Stem"
stem.rotation_euler = (0, 0.15, 0)
stem.data.materials.append(mat_brown)
bpy.ops.object.shade_smooth()
stem.parent = apple

# Leaf
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.18, location=(0.15, 0, 2.0))
leaf = bpy.context.active_object
leaf.name = "Leaf"
leaf.scale = (1.5, 0.8, 0.3)
leaf.rotation_euler = (0.2, 0.5, -0.4)
leaf.data.materials.append(mat_green)
bpy.ops.object.shade_smooth()
leaf.parent = apple

# 8. Left Arm (Resting)
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.5, location=(-0.95, 0, 0.85))
left_arm = bpy.context.active_object
left_arm.name = "Left_Arm"
left_arm.rotation_euler = (0, 0.4, 0)
left_arm.data.materials.append(mat_black)
bpy.ops.object.shade_smooth()

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, location=(-1.05, 0, 0.62))
left_glove = bpy.context.active_object
left_glove.name = "Left_Glove"
left_glove.data.materials.append(mat_white)
bpy.ops.object.shade_smooth()

left_arm.parent = apple
left_glove.parent = apple

# 9. Right Arm Group (Pivot/Empty at shoulder joint)
bpy.ops.object.empty_add(type='PLAIN_AXES', location=(0.75, 0, 1.0))
right_arm_pivot = bpy.context.active_object
right_arm_pivot.name = "Right_Arm_Pivot"
right_arm_pivot.parent = apple

# Add Arm cylinder inside group
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.45, location=(0.18, 0, 0.18))
right_arm = bpy.context.active_object
right_arm.name = "Right_Arm"
right_arm.rotation_euler = (0, -0.85, 0)
right_arm.data.materials.append(mat_black)
bpy.ops.object.shade_smooth()
right_arm.parent = right_arm_pivot

# Add Glove hand
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, location=(0.34, 0, 0.34))
right_glove = bpy.context.active_object
right_glove.name = "Right_Glove"
right_glove.data.materials.append(mat_white)
bpy.ops.object.shade_smooth()
right_glove.parent = right_arm_pivot

# 10. Legs and Shoes
# Left Leg
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.35, location=(-0.25, 0, 0.25))
left_leg = bpy.context.active_object
left_leg.name = "Left_Leg"
left_leg.data.materials.append(mat_black)
bpy.ops.object.shade_smooth()

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, location=(-0.28, -0.05, 0.08))
left_shoe = bpy.context.active_object
left_shoe.name = "Left_Shoe"
left_shoe.scale = (1.4, 0.8, 1)
left_shoe.data.materials.append(mat_brown)
bpy.ops.object.shade_smooth()

left_leg.parent = apple
left_shoe.parent = apple

# Right Leg
bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.35, location=(0.25, 0, 0.25))
right_leg = bpy.context.active_object
right_leg.name = "Right_Leg"
right_leg.data.materials.append(mat_black)
bpy.ops.object.shade_smooth()

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.12, location=(0.28, -0.05, 0.08))
right_shoe = bpy.context.active_object
right_shoe.name = "Right_Shoe"
right_shoe.scale = (1.4, 0.8, 1)
right_shoe.data.materials.append(mat_brown)
bpy.ops.object.shade_smooth()

right_leg.parent = apple
right_shoe.parent = apple

# 11. Lighting Setup (Camera and Lights)
# Studio Point Light
bpy.ops.object.light_add(type='POINT', radius=1.0, location=(2.5, -3.0, 3.5))
light = bpy.context.active_object
light.name = "Studio_Light"
light.data.energy = 500

# Back/Rim Light
bpy.ops.object.light_add(type='POINT', radius=1.0, location=(-2.0, 2.5, 3.5))
light_back = bpy.context.active_object
light_back.name = "Rim_Light"
light_back.data.energy = 300

# Camera
bpy.ops.object.camera_add(location=(0, -4.5, 1.2), rotation=(math.radians(82), 0, 0))
camera = bpy.context.active_object
camera.name = "Camera"
bpy.context.scene.camera = camera

# 12. ANIMATION KEYFRAMING
# Wave Waving loop for Right_Arm_Pivot (rotate around Y axis)
for f in range(1, 61):
    bpy.context.scene.frame_set(f)
    
    # Breathing (Squash & Stretch) on Apple_Body Scale
    breathe = math.sin(f * (2 * math.pi / 28)) # breathing period
    apple.scale = (1.0 - breathe * 0.015, 1.0 - breathe * 0.015, 1.0 + breathe * 0.025)
    apple.location.z = 1.0 + breathe * 0.015
    apple.keyframe_insert(data_path="scale", index=-1)
    apple.keyframe_insert(data_path="location", index=-1)
    
    # Waving (Rotate right arm pivot on Y-axis back and forth)
    wave = math.sin(f * (2 * math.pi / 15)) # waving period (faster)
    right_arm_pivot.rotation_euler.y = wave * 0.35
    right_arm_pivot.keyframe_insert(data_path="rotation_euler", index=-1)
    
    # Random Blinking
    # Blink between frames 25-30 and 50-55
    if (25 <= f <= 30) or (50 <= f <= 55):
        peak = 27 if (25 <= f <= 30) else 52
        dist = abs(f - peak)
        scale_z = 0.1 + (dist / 3.0) * 0.9
    else:
        scale_z = 1.0
        
    left_eye.scale.z = scale_z * 1.2
    right_eye.scale.z = scale_z * 1.2
    left_eye.keyframe_insert(data_path="scale", index=-1)
    right_eye.keyframe_insert(data_path="scale", index=-1)

# Reset frame to 1
bpy.context.scene.frame_set(1)

# Save file
blend_file_path = "c:\\Users\\omar\\Desktop\\Huda-Nour-Site\\bloomly-kids\\apple_mascot_animated.blend"
bpy.ops.wm.save_as_mainfile(filepath=blend_file_path)
print("SUCCESS: 3D apple mascot designed, animated, and saved to: " + blend_file_path)
