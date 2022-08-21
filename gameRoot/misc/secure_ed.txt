<h1><b><u>Secure Web Application</u></b></h1>

<b>Augusta University - Spring 2022 Senior Capstone Project</b>

<b><u>Group members:</u></b>
<ul>
<li><a href="https://github.com/namingwrongs" target="_blank">namingwrongs</a></li>
<li><a href="https://github.com/ahall1315" target="_blank">ahall1315</a></li>
<li><a href="https://github.com/BMcclammy99" target="_blank">BMcclammy99</a></li>
<li><a href="https://github.com/jparker2049" target="_blank">jparker2049</a></li>
</ul>


<h2><b><u>Setup:</u></b></h2>

<b><u>Step 1: Installation</u></b>

Clone the repository, or simply download and unzip it to the directory of your choosing.

<b><u>Step 2: Startup</u></b>


In the installation folder, open startup.bat ー this will open the web server the background, and then it will open the web app in your default browser.

<b>IMPORTANT NOTE:</b> The web server runs as a background process (nginx.exe). If it is running, you should see it in the task manager. The web server also require another process, called php-cgi.exe, to process php files. DO NOT shut down the web server or close php-cgi until you are done, as you will need to restart the server, and doing so will reset your progress.


<b><u>Step 3: Usage</u></b>

Follow the instructions in the user manual.

<b><u>Step 4: Closing the web server</u></b>

Simply enter yes in the prompt to shut down the server, or run shutdown.bat, and the web server will shut down immediately. You may now close php-cgi.exe. Restarting the webserver is as simple as opening startup.bat again, but note that it will reset the database automatically when you do.