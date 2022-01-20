# mpeg-dash-hls-nodejs-streamer
Liteweight DASH and HLS VOD Streamer using NodeJS.


..\Bento4-SDK-1-6-0-639.x86_64-microsoft-win32\bin\mp4info.exe .\dolby-vision-amaze-1080.mp4

..\Bento4-SDK-1-6-0-639.x86_64-microsoft-win32\bin\mp4fragment.exe ".\Gemini Man  DolbyVisionDolby Atmos_1080.mp4" ".\Gemini Man  DolbyVisionDolby Atmos_1080_frag.mp4" --debug

..\Bento4-SDK-1-6-0-639.x86_64-microsoft-win32\bin\mp4dash.bat --mpd-name manifest.mpd ".\Gemini Man  DolbyVisionDolby Atmos_1080_frag.mp4" -o "Gemini Man  DolbyVisionDolby Atmos_1080" --use-segment-timeline

## Setting Up the Project
1. The project has a few external dependencies listed below which are required, So I have made a bash script - **dependencies.sh** which can easily install and setup the required dependencies on `Windows`, `MacOS` and `Linux`. For `Windows` you just need to write ```./dependencies.sh``` in *Git Bash* and for `MacOS` and `Linux` you need to run the same command in *Terminal*.
   - [Bento4](#)
   - [Node Fluent FFMPEG](#) 
2. To start the project, first install the node modules via the command ```npm install``` and then to run the project in **PRODUCTION** mode use ```npm start``` and in **DEVELOPMENT** mode use ```npm dev```.

## API Documentation
1. Upload Video

    Request Type| Endpoint | Meta
    ------------ | -------| -----|
    |`POST`|/api/admin/upload | Will allow you to upload video files and get session ID.

    **Headers:**
    Key | Value | Required
    ------------ | -------| -----|
    |Content-Type| `multipart/form-data` | False

    **Body:** 
    
        Type:form-data
        key: file, value: #FileToUpload

    **Response:**

        {
            "session":"<unique-session-id>",
            "contentId":<unique-content-id>,
            "fileType":"<file-extension-type>",
            "expiry":"<session-expiry>"
        }

2. 
