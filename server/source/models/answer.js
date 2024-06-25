module.exports = class Answer{
    text=''
    img=''
    weight=0

    constructor(text,img,weight){
        this.text = text;
        this.img = img;
        this.weight = weight;
    }

    ToJson() {
        return {
            text:this.text,
            img:this.img,
            weight:this.weight
        }
    }

}



