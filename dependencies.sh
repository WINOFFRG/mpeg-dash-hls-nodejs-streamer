#!/bin/bash
case $(uname -s) in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN"
esac

MAC_DOWNLOAD_URL="https://www.bok.net/Bento4/binaries/Bento4-SDK-1-6-0-639.universal-apple-macosx.zip"
LINUX_DOWNLOAD_URL="https://www.bok.net/Bento4/binaries/Bento4-SDK-1-6-0-639.x86_64-unknown-linux.zip"
WIN_DOWNLOAD_URL="https://www.bok.net/Bento4/binaries/Bento4-SDK-1-6-0-639.x86_64-microsoft-win32.zip"

if [ "$machine" = "UNKNOWN" ]; then
    echo "Unkown OS Detected"
    exit 1
fi

echo "Cloning in ${PWD}/tools"
rm -rf tools
mkdir tools
cd tools

if [ "$machine" = "Mac" ]; then
    echo "Mac detected 💻";
    curl -fsSL $MAC_DOWNLOAD_URL -o Bento4-SDK.zip;
    echo "Extracting Zip ... 📁"
    unzip -q -o Bento4-SDK.zip;
    echo "Final Cleanup 🗑️"
    mv Bento4-SDK-*/ ./Bento4-SDK/;
    rm -rf Bento4-SDK.zip
    echo "Installed Bento4 SDK in ${PWD}/Bento4-SDK";

elif [ "$machine" = "Linux" ]; then
    echo "Linux detected 💻"
    curl -fsSL $LINUX_DOWNLOAD_URL -o Bento4-SDK.zip;
    echo "Extracting Zip ... 📁"
    unzip -q -o Bento4-SDK.zip;
    echo "Final Cleanup 🗑️"
    mv Bento4-SDK-*/ ./Bento4-SDK/;
    rm -rf Bento4-SDK.zip
    echo "Installed Bento4 SDK in ${PWD}/Bento4-SDK";

else
    echo "Windows detected 💻"
    curl -fsSL $WIN_DOWNLOAD_URL -o Bento4-SDK.zip;
    echo "Extracting Zip ... 📁"
    unzip -q -o Bento4-SDK.zip;
    echo "Final Cleanup 🗑️"
    mv Bento4-SDK-*/ ./Bento4-SDK/;
    rm -rf Bento4-SDK.zip
    echo "Installed Bento4 SDK in ${PWD}/Bento4-SDK";

fi
