dir=$(dirname $0)
cd $dir && cd ..

rm -rf dist
rm -rf ./*.tar.gz

yarn build
cp -f ./package.json ./dist/package.json
cp -f ./yarn.lock ./dist/yarn.lock
cd ./dist
yarn install --production

tar -zcvf ../werido.tar.gz * && cd ..
scp ./werido.tar.gz root@8.140.187.127:/root/tars
