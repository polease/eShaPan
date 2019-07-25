import ListType from '../data/list-type.json';
import SampleList from '../data/list.json';

/** True = 65%, False = 35% */
const rejectByChance = () => {
  return Math.random() <= 0.35
}

/** Get table data */
export const emulateGetListTypes = () => new Promise((resolve, reject) => {
    if (rejectByChance()) {
      return reject({
        error: 'Server error'
      })
    }
    const delay = parseInt( Math.random() * 1000 )
    setTimeout(() => { resolve(ListType) }, delay)
  })
/** Get table data */
export const emulateGetListDetails = (id) => new Promise((resolve, reject) => {
     
    const delay = parseInt( Math.random() * 1000 )
    setTimeout(() => { resolve(SampleList) }, delay)
  })
    
/** Emuate delete request */
export const emulateDeleteRequest = () => new Promise((resolve, reject) => {
  if (rejectByChance()) {
    return reject({
      error: 'Server error'
    })
  }
  const delay = parseInt( Math.random() * 1000 )
  setTimeout(() => { resolve({message: 'deleted'}) }, delay)

})