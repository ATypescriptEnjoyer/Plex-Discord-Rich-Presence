yarn build
node --experimental-sea-config sea-config.json
node -e "require('fs').copyFileSync(process.execPath, 'app.exe')"
signtool remove /s app.exe
npx postject app.exe NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2