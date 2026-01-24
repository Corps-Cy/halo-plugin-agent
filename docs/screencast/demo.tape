# Output file
Output demo.gif

# Settings
Set FontSize 16
Set Width 1200
Set Height 600
Set Padding 20
Set FontFamily "JetBrains Mono"
Set Theme "Dracula"

# Start recording
Type "hps init my-plugin"
Sleep 1s
Enter

# Simulate AI Selection
Sleep 2s
Type "j"  # Select Opencode (Down arrow simulation)
Sleep 500ms
Enter

# Simulate Project Info
Sleep 1s
Type "My Awesome Plugin"
Enter
Sleep 500ms
Enter # Default domain
Sleep 500ms
Type "Halo Dev"
Enter

# Simulate UI Tool Selection
Sleep 1s
Enter # Select Rsbuild (Default)

# Simulate CLI execution
Sleep 5s

# Show the installed skill
Type "ls -R .opencode/skills"
Enter
Sleep 3s

# End
