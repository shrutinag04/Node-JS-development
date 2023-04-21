const {v4:uuidv4}=require('uuid');
const items=[
    {
        id:'1',
        name:'Treat You Better',
        category:'Shawn Mendes',
        details:'Shawn Mendes of Canada and Camila Cabello of Cuba collaborated on the song Seorita. It was released as the second single (seventh overall) from Mendes self-titled third studio albums deluxe version on June 21, 2019,and was later included on Cabellos second studio album Romance (2019).',
        status:'available',
        image:'images/shawn.jpeg',
        year:'2021'
    },
    {
        id:'2',
        name:'Senorita',
        category:'Shawn Mendes',
        details:'Shawn Mendes of Canada and Camila Cabello of Cuba collaborated on the song Seorita. It was released as the second single (seventh overall) from Mendes self-titled third studio albums deluxe version on June 21, 2019,and was later included on Cabellos second studio album Romance (2019).',
        status:'available',
        image:'images/shawn.jpeg',
        year:'2021'
    },
    {
        id:'3',
        name:'Who Says',
        category:'Selena Gomez',
        details:'Shawn Mendes of Canada and Camila Cabello of Cuba collaborated on the song Seorita. It was released as the second single (seventh overall) from Mendes self-titled third studio albums deluxe version on June 21, 2019,and was later included on Cabellos second studio album Romance (2019).',
        status:'available',
        image:'images/shawn.jpeg',
        year:'2021'
    },
    {
        id:'4',
        name:'Wolves',
        category:'Selena Gomez',
        details:'Shawn Mendes of Canada and Camila Cabello of Cuba collaborated on the song Seorita. It was released as the second single (seventh overall) from Mendes self-titled third studio albums deluxe version on June 21, 2019,and was later included on Cabellos second studio album Romance (2019).',
        status:'available',
        image:'images/shawn.jpeg',
        year:'2021'
    },
    
];
  exports.find= ()=> items;
  exports.findById=id=> items.find(items=>items.id===id);
  exports.save=function(item){
    item.id=uuidv4();
    items.push(item);
};
exports.find=()=> groupBy( items,"category" );
exports.updateById= function(id,newItem){
    let item=items.find(item=>item.id===id);
    if(item){
        item.name=newItem.name;
        item.details=newItem.details;
        return true;
    }else{
        return false;
    }
} 
exports.deleteById=function(id){
    let index=items.findIndex(items=>items.id===id);
    if(index!==-1){
        items.splice(index,1);
        return true;
    }
    else{
        return false;
    }
}

let groupBy = (array, key) => {
    return array.reduce((result, obj) => {
       (result[obj[key]] = result[obj[key]] || []).push(obj);
       return result;
    }, {});
 };
