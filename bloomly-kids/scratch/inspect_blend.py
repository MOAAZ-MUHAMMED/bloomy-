import bpy

blend_file_path = "c:\\Users\\omar\\Desktop\\Huda-Nour-Site\\bloomly-kids\\apple_mascot.blend"
bpy.ops.wm.open_mainfile(filepath=blend_file_path)

print("--- OBJECTS IN THE FILE ---")
for obj in bpy.data.objects:
    print(f"- {obj.name} (Type: {obj.type})")
print("---------------------------")
