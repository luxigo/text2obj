text2obj
========

Generate a javascript object from a "system_profiler" style textual data structure

Example input:

    Power:
      System Power Settings:

        AC Power:
         System Sleep Timer (Minutes): 0
          Disk Sleep Timer (Minutes): 10
          Display Sleep Timer (Minutes): 10
          Sleep On Power Button: Yes
          Automatic Restart On Power Loss: No
          Wake On LAN: Yes
          Current Power Source: Yes
          Display Sleep Uses Dim: Yes

      Hardware Configuration:

        UPS Installed: No

Example output:

    {
      Power: {
        'System Power Settings': {
          'AC Power': {
            'System Sleep Timer (Minutes)': '0',
            'Display Sleep Uses Dim': 'Yes',
            'Current Power Source': 'Yes',
            'Disk Sleep Timer (Minutes)': '10',
            'Sleep On Power Button': 'Yes',
            'Automatic Restart On Power Loss': 'No',
            'Display Sleep Timer (Minutes)': '10',
            'Wake On LAN': 'Yes'
          }
        },
        'Hardware Configuration': {
          'UPS Installed': 'No'
        }
      }
    }


Usage:

     text2obj - | <filename> [ <property_to_extract> ]
     

Note:
     On the command line, replace spaces with underscores in the property names 
     

Examples:

     system_profiler SPHardwareDataType | text2obj - Hardware.Hardware_Overview.Hardware_UUID
     
     text2obj system_profile.txt
     
     text2obj system_profile.txt Hardware
	
	
