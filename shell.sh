echo "goorm.js"
uglifyjs -o goorm.min.js goorm.js

rm -rf ./modules_min
cp -rf ./modules ./modules_min
for name in $(find ./modules_min/ -name "*.js" ); do
    uglifyjs -o $name --overwrite $name
    echo $name
done

