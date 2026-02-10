

export const dataFlat = (data: any[], key: string, flatData: any[] = []) => {
  data.forEach((item: any) => {
    if(item[`${key}`] && Array.isArray(item[`${key}`])){
      dataFlat(item[`${key}`], key, flatData)
    }else{
      flatData.push(item);
    }
  })

  return flatData
}
