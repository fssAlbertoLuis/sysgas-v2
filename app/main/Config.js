import fs from 'fs';

export default (dir) => {
  let data = null;

  const checkFolder = () => {
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, {recursive: true});
    }
  }

  const save = (newData) => {
    data = {...newData};
    try {
      fs.writeFileSync(`${dir}/configs.json`, JSON.stringify(data, null, 2));
      return true;
    } catch (e) {
      console.log('Couldn\'t update data.json', e);
    }
  }

  const get = () => {
    try {
      if (data) {
        return data;
      } else {
        checkFolder();
        const file = dir+'/configs.json';
        if (fs.existsSync(file)) {
          data = {...JSON.parse(fs.readFileSync(file))};
        } else {
          save({firstRun: true, theme: 'bp3-dark'});
        }
        return data;
      }
    } catch (e) {
      console.log(e);
    }
  }

  return {save, get};
}