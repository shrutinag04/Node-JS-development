const {DateTime}=require("luxon");
const {v4:uuidv4}=require('uuid');
const stories=[
    {
        id:'1',
        title:'A funny story',
        content:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry.',
        author:'Shruti',
        createdAt:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id:'2',
        title:'It is rainning',
        content:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry.',
        author:'Shruti',
        createdAt:DateTime.local(2021,2,12,18,0).toLocaleString(DateTime.DATETIME_SHORT)
    }
];
exports.find= ()=> stories;
exports.findById=id=> stories.find(story=>story.id===id);
exports.save=function(story){
    story.id=uuidv4();
    story.createdAt=DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
    stories.push(story);
};
exports.updateById= function(id,newStory){
    let story=stories.find(story=>story.id===id);
    if(story){
        story.title=newStory.title;
        story.content=newStory.content;
        return true;
    }else{
        return false;
    }
}
exports.deleteById=function(id){
    let index=stories.findIndex(story=>story.id===id);
    if(index!==-1){
        stories.splice(index,1);
        return true;
    }
    else{
        return false;
    }
}
