
## 📦 Install Dependencies

```bash
npm install
```
## Start Application

Development Mode
```bash 
npm run dev
```

Production Mode 

First build (if build script exists):
```bash 
npm run build
```

Then start:
```bash
npm start
```
## Start With PM2 (Production)
First build (if build script exists):
```bash 
npm run build
```

start :
```bash
pm2 start dist/server.js
```

stop :
```bash 
pm2 stop server.js
```
