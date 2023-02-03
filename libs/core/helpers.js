import deepmerge from 'deepmerge'
import _ from 'lodash'
import moment from 'moment'

const { has, sortBy, get, isNil, isObject, omit, isEqual, capitalize, round } = _
 
// const sendType = (cell, row, data) => {
//     if( cell?.action?.source == 'cell')
//         return cell
//     else if( cell?.action?.source == 'row')
//         return { ...row, [cell.key]: data }
//     else if( cell?.action?.source == 'field')
//         return { [cell.key]: data }
//     else if( cell?.action?.source == 'context')
//         return mergeDeep(cell?.action?.data, { overwrite: {api:{ resource:row }}, row: get(row, cell?.action?.id, data) })
//     else if( cell?.action?.source == 'custom')
//         return cell?.action?.data
//     else    
//         return data
// }

export const mergeDeep  = (a = {}, b = {}) => {
    return deepmerge(a, b, {
        arrayMerge: (d, s) => {
            return [ ...d, ...s ]
        }
    })
}

export const getErrorMessage = (error) => {
    if(error){
        if( get(error, 'code', '') == "ECONNREFUSED" ){
            return error.message + "( " + get(error, 'config.url') + ")"
        }

        if( has(error, 'response.data.message') )
            return get(error, 'response.data.message')

        if( get(error, 'message') )
            return get(error, 'message')

        if( typeof error == 'string' )
            return error
    }
    return ""
}

// const formatModel = (columns=[], data) => {
//     columns.map(i => {
//         if( data[i.prop] && ['date'].includes(i.type) ){ 
//             let format = ( i.type == 'date' ? 'YYYY-MM-DD': 'YYYY-MM-DD\\Thh:mm:ss' )
//             data[i.prop] = formatDate(data[i.prop], format, null, true)
//         } 
//     })
//     return data
// }

// const formatOutput = (columns=[], data) => {
//     console.debug('formatOutput', data)
//     let extractdata = (col = {}, k) =>  {
//         if( col.children && Array.isArray(col.children) )  col.children.map( i => extractdata(i, k))
//         if( get(col, 'name', false) ){
//             if( col.ignored && data[col.name] ) {
//                 console.debug('formatOutput ignored', col)
//                 data = omit(data, [col.name]) 
//             }
//         }
//     }
//     columns.map((col, k) => {
//             extractdata(col, k)
//     })
//     console.debug('formatOutput out', data)
//     return data
// }

export const formatDate = function(value, format, from, utc=false) {
    if (value) {
      let date = moment(String(value), from)
      console.log('formatDate', value, date)
      if(utc) date = date.utc()
      return date.format(format)
    }
}

export const interpolate = (string, scope, def) => {
    if( typeof string !== 'string' ) return string; 

    return string.replace(/\{([^}]*)}/g, (r,k) => get(scope, k, (def ? def:'{'+k+'}')) );
}

export const queryString = (params, join, data) => {
    let rtn = ''
    let arrQuery = []
    if( isObject(params) && Object.keys(params).length > 0 ){
        Object.keys(params).map(k => {
            if( Array.isArray(params[k]) )
                params[k].map(i => arrQuery.push([ interpolate(k, data), interpolate(i, data)]) )
            else
                arrQuery.push([interpolate(k, data), interpolate(params[k], data)])
        })

        rtn = join+new URLSearchParams( arrQuery )
    }
    return rtn
}

export const filterParams = (api, queryInfo) => { 
    let { page, pageSize, sort, filters } = queryInfo || {}
    let { params = {}, pagination = {} } = api || {}
    if( !isNil(page) && has(pagination, 'pageField') )
        params[ pagination.pageField || 'page' ] = page
    if( !isNil(pageSize) && has(pagination, 'limitField') )
        params[ pagination.limitField || 'limit'] = pageSize
    if( sort && !isNil(sort.prop) && !isNil(sort.order) && has(pagination, 'sortField') && has(pagination, 'sortExp') ){
        let pagData = {prop: sort.prop, sort: sort.order == 'ascending'? get(pagination,'sortAscChar','asc'): get(pagination, 'sortDescChar', 'desc')}
        params[ pagination.sortField || 'order' ] = interpolate( get(pagination, 'sortExp', '{prop},{order}'), pagData)
    }

    if( get(queryInfo, 'filters', []).length > 0 ){
      for(let i = 0; i < get(queryInfo, 'filters', []).length; i++ ){  
        let filterField = interpolate(
          get(filters[i], 'filterField', (pagination?.filterField || 'filter')), 
          get(filters, '[0]', {}) 
        )
        let filterExp = get(filters[i], 'filterExp', (pagination?.filterExp || '{prop},like,%{value}%'))
        if ( !params[filterField] ) params[ filterField ] = []
        if( has(filters, `[${i}].prop`) && has(filters, `[${i}].value`) && filters[i].value && has(pagination, 'filterField') && (has(pagination, 'filterExp') || has(filters[i], 'filterExp')) )
            params[ filterField ].push( interpolate(filterExp, filters[i]) )
      }
    }else if( has(pagination, 'filterField') ){
      let filterField = interpolate(
        get(pagination, 'filterField', 'filter'), 
        get(filters, '[0]', {}) 
      )
      delete params[ filterField ]
    }
    console.log('filter params', params)
    return {...api, params};
}

// const getLocalStorage = (key, json=true) => {
//     try{
//         let ls = window.localStorage.getItem(key)
//         if( ls ){
//             if( json ) ls = JSON.parse(ls)
//             return ls
//         }
//         return null
//     }catch(e){
//         console.log('getLocalStorage', e)
//         return null
//     }
// }

// const setLocalStorage = (key, data, json=true) => {
//     try{
//         if( key ){
//             if( json ) data = JSON.stringify(data)
            
//             let ls = window.localStorage.setItem(key, data)
//             return ls
//         }
//         return true
//     }catch(e){
//         console.log('setLocalStorage', e)
//         return false
//     }
// }

// const saveSettings = (data) => {
//     try{
//         let settings = getLocalStorage('settings') || {}

//         settings = { ...settings, ...data }

//         setLocalStorage('settings', settings)

//         return settings
//     }catch(e){
        
//         console.log('saveSettings', e)
//     }
// }

// const isRegex = (data, reg, custom=false) => {
//     let rgs ={
//         url: "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.)"
//     }
//     if( !rgs[reg] && !custom ) return ;

//     var regex = new RegExp( rgs[reg] || reg );

//     console.debug('isRegex', rgs[reg], data, regex.test(data))
//     return regex.test(data)
// }  


///
// TABLES
//

export const schemaColumns = (properties) => {
  // let columns = [ { label: '', key: "_selected", filter: false, sorter:false, sort: -1 } ]
  let columns = [  ]
  let extractdata = (col = {}, k) =>  {
      if( col.children && Array.isArray(col.children) )  col.children.map( i => extractdata(i, k))
      if( get(col, 'config.grid', false) )
          columns.push({
              sort: get(col, 'config.sort', k+1),
              key: get(col, 'name', col.id),
              label: get(col, 'config.label', capitalize((col.label || col.name))),
              type: get(col, 'config.type', (col.type || 'text')),
              action: Object.assign( get(col, 'config.action',{}), get(col, 'attributes', {}) ),
              options: get(col, 'options', {}),
              model: get(col, 'model', {}),
              overwrite: get(col, 'overwrite', {}),
              sorter: get(col, 'config.sorter', true),
              filter: get(col, 'config.filter', true),
              _classes: get(col, 'config.classes'),
              _style: get(col, 'config.styles'),
          })
  }
  properties.map((col, k) => {
          extractdata(col, k)
  })

  // columns.push({ label: '', key: 'actions', filter: false, sorter: false })

  return sortBy(columns, ['sort'])
}

export const can = (schema, attr) => {
  return get(schema, attr, true)
}

export const isSelected = (rows, row) => {
    return rows.findIndex(i => _.isEqual(i, row) ) >= 0
}

export const selectionChange = (rows, row, index) => {
    let key = rows.findIndex(i => isEqual(i, row) )
    if( key >= 0 )   
      rows.splice(key, 1)
    else
      rows.push(row)
    return rows
}

export const selectionAll = (rows, data) =>{
  if( rows.length == data.length ){
    rows = []
  }else
    rows = data
  return rows
}

export const fetchQueryInfo = (type, data) => {
  console.debug("fetch query info", type, data)
  let queryInfo = { type }
  if( type == 'sort' ){
    queryInfo.sort = { prop: data.column, order: data.asc === true ? 'ascending':'descending' }
  }
  if( type == 'filter' ){
    queryInfo.filters = Object.keys(data).map((key) => ({ 
      prop: key, value: data[key]?.value, filterExp: data[key]?.filter?.filterExp, filterField: data[key]?.filter?.filterField
    }))
  }
  if( type == 'page' ){
    queryInfo.page = data
  }
  if( type == 'pageSize' ){
    queryInfo.pageSize = data
  }
  
 return queryInfo
}

export const validateQueryInfo = (queryInfo) => { 
  if( !queryInfo || typeof queryInfo !== 'object' ) return false;
  
  if( ['sizeChange', 'pageSize', 'size', 'pageChange', 'sort', 'filter', 'page', 'init'].includes(queryInfo.type) ){
      if( queryInfo.type == 'filter' &&  !get(queryInfo, 'filters[0].prop')  )
          return false;
  }

  return true
}

export const calcPages = (totalRows, perPage) => {
  let count = (totalRows || 1) / perPage
  let rounded = round(count)
  return count > rounded ? rounded + 1 : rounded
}

export const normalizeInput = async (row, modifier) => {  
  if( typeof row == 'string' ) return row

  if( row.children && Array.isArray(row.children) )
    for(let idx in row.children){ 
      row.children[idx] = await normalizeInput(row.children[idx], modifier)
    }  

  if( row['$el'] ) return row

  let input = {
    ...row,
    label: _.get(row, 'label', _.capitalize(row?.name ?? '')),
    placeholder: _.get(row, 'placeholder', _.capitalize(row?.name ?? '')),
  }
  if( input['type'] || (!input['$cmp'] && !input['$el'] && !input['type']) ) input['$formkit'] = input.type || 'text'
 
  if( modifier && typeof modifier == 'function') input = await modifier(input)

  return input
}