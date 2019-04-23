# StreamControlPlusPlus
StreamControl++ is a more enhanced, extensible, and accesible version of the popular StreamControl software used by many live stream producers. SC++ is written in Nodejs and Typescript, leveraging Electron to create a native app regardless of your Operating System.

# Authors
* Brandon Cooke <brandoncookedev@gmail.com>

## Development
### How to run
----
Run the following commands
* `npm i` 
* `npm i -g typescript`
* `tsc`
* `npm start`

### Running via Gulp
Gulpjs is a task running that simplifies life for node devs heavily. This project is attuned 
to running tasks in gulp for convenience. To start, run the following:
```
npm i -g gulp gulp-cli
```
Then run the project as such (from project root):
```
gulp run
```