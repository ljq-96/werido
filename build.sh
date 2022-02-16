dir=$(dirname $0)
cd $dir

rm -rf dist
rm -rf ./*.tar.gz

cd ./serve && npm run build
cd ../web && npm run build
cd ../dist && tar -zcvf ../werido.tar.gz * && cd ..

scp ./werido.tar.gz root@8.140.187.127:/root/tars
