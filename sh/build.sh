dir=$(dirname $0)
cd $dir && cd ..

rm -rf dist
rm -rf ./*.tar.gz

cd ./serve && ncc build index.ts -o ../dist
cd ../ && npm run web:build
cd ./dist && tar -zcvf ../werido.tar.gz * && cd ..

scp ./werido.tar.gz root@8.140.187.127:/root/tars
