const getYearsDifference = (date1 , date2) =>{
    const d1 = new Date(date1);
    let d2;
    if(!date2){
        d2 = new Date();
    }
    else{
        d2 = new Date(date2)
    }
    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    if (months < 0) {
        years--;
        months+= 12;
    }
    return [years,months];
}

module.exports = getYearsDifference;