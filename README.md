# oneM2M Vue Application - Guide

## Installation

1. Requirements before installation
    1. Download or Clone Code from Github
    2. Install nvm
    3. Install node.js v22.12.0 (If it’s not installed)
        
        ```powershell
        # Install node.js
        $ nvm install v22.12.0
        # To check the version of node.js
        $ node.js -v
        ```
        
2. Run codes in console opened in ‘**vue-project’** directory
    
    ```powershell
    $ npm install
    $ npm run serve # or npm run dev
    ```
    

## Features

1. Create Request
    1. Click Create Button
    2. Fill editable attributes(Some are mandatory.) + body
    3. Click Send Button
    4. If it’s successfully retrieved the resource, response body will appear message from server. 
    5. If not, response body will appear nothing or error code.
        
        ![스크린샷 2025-02-20 202130.png](images/6199568f-ee29-43d6-ab5e-a8f68c550d7b.png)
        
        ![스크린샷 2025-02-20 202303.png](images/7e89b5ce-3205-418b-996b-a8785aab7daa.png)
        
2. Retrieve Request
    1. Click Retrieve Button
    2. Fill editable attributes(Some are mandatory)
    3. Click Retrieve Button
    4. If it’s successfully retrieved the resource, response body will appear with data from server. 
    5. If not, response body will appear nothing or error code.
        
        ![스크린샷 2025-02-20 203748.png](images/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2025-02-20_203748.png)
        
        ![스크린샷 2025-02-20 203805.png](images/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2025-02-20_203805.png)
        
3. Update Request
    1. Click Update Button
    2. Fill editable attributes(Some are mandatory) + body
    3. Click Update Button
    4. If it’s successfully retrieved the resource, response body will appear message from server. 
    5. If not, response body will appear nothing or error code.
        
        ![스크린샷 2025-02-20 203924.png](images/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2025-02-20_203924.png)
        
        ![스크린샷 2025-02-20 203938.png](images/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2025-02-20_203938.png)
        
4. Delete Request
    1. Click Delete Button
    2. Fill editable attributes(Some are mandatory)
    3. Click Delete Button
    4. If it’s successfully retrieved the resource, response body will appear message from server. 
    5. If not, response body will appear nothing or error code.
        
        ![스크린샷 2025-02-20 204019.png](images/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2025-02-20_204019.png)