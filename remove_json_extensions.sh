for f in *.json; do 
    mv -- "$f" "${f%.json}"
done