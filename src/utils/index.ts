// ** Types
// import { TItemOrderProduct } from 'src/types/order-product'

// ** Libraries
import { ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'

export const toFullName = (lastName: string, middleName: string, firstName: string, language: string) => {
  if (language === 'vi') {
    return `${lastName ? lastName : ''} ${middleName ? middleName : ''} ${firstName ? firstName : ''}`.trim()
  }

  return `${firstName ? firstName : ''} ${middleName ? middleName : ''} ${lastName ? lastName : ''}`.trim()
}

export const convertBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

export const separationFullName = (fullName: string, language: string) => {
  const result = {
    firstName: '',
    middleName: '',
    lastName: ''
  }
  const arrFullName = fullName.trim().split(' ')?.filter(Boolean)
  if (arrFullName?.length === 1) {
    if (language === 'vi') {
      result.firstName = arrFullName.join()
    } else if (language === 'en') {
      result.lastName = arrFullName.join()
    }
  } else if (arrFullName.length === 2) {
    if (language === 'vi') {
      result.lastName = arrFullName[0]
      result.firstName = arrFullName[1]
    } else if (language === 'en') {
      result.lastName = arrFullName[1]
      result.firstName = arrFullName[0]
    }
  } else if (arrFullName.length >= 3) {
    if (language === 'vi') {
      result.lastName = arrFullName[0]
      result.middleName = arrFullName.slice(1, arrFullName.length - 1).join(' ')
      result.firstName = arrFullName[arrFullName.length - 1]
    } else if (language === 'en') {
      result.lastName = arrFullName[arrFullName.length - 1]
      result.middleName = arrFullName.slice(1, arrFullName.length - 1).join(' ')
      result.firstName = arrFullName[0]
    }
  }

  return result
}

export const getAllValueOfObject = (obj: any, arrExlude?: string[]) => {
  try {
    const values: any[] = []
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        values.push(...getAllValueOfObject(obj[key], arrExlude))
      } else {
        if (!arrExlude?.includes(obj[key])) {
          values.push(obj[key])
        }
      }
    }

    return values
  } catch (error) {
    return []
  }
}

export const formatFilter = (filter: any) => {
  const result: Record<string, string> = {}
  Object.keys(filter)?.forEach((key: string) => {
    if (Array.isArray(filter[key]) && filter[key]?.length > 0) {
      result[key] = filter[key].join('|')
    } else if (filter[key]) {
      result[key] = filter[key]
    }
  })

  return result
}