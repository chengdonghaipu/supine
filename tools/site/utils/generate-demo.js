const path = require('path');
const fs = require('fs');
const capitalizeFirstLetter = require('./capitalize-first-letter');
const camelCase = require('./camelcase');

module.exports = function (showCaseComponentPath, result) {
  if (result.pageDemo) {
    const pageDemoComponent = generatePageDemoComponent(result);
    fs.writeFileSync(path.join(showCaseComponentPath, `zh.page.component.ts`), pageDemoComponent.zh);
    fs.writeFileSync(path.join(showCaseComponentPath, `en.page.component.ts`), pageDemoComponent.en);
  }
  const demoTemplate = generateTemplate(result);
  fs.writeFileSync(path.join(showCaseComponentPath, `zh.html`), demoTemplate.zh);
  fs.writeFileSync(path.join(showCaseComponentPath, `en.html`), demoTemplate.en);
  const demoComponent = generateDemoComponent(result);
  fs.writeFileSync(path.join(showCaseComponentPath, `zh.component.ts`), demoComponent.zh);
  fs.writeFileSync(path.join(showCaseComponentPath, `en.component.ts`), demoComponent.en);
  const demoModule = generateDemoModule(result);
  fs.writeFileSync(path.join(showCaseComponentPath, `index.module.ts`), demoModule);
};

function generateDemoModule(content) {
  const demoModuleTemplate = String(fs.readFileSync(path.resolve(__dirname, '../template/demo-module.template.ts')));
  const component = content.name;
  const demoMap = content.demoMap;
  let imports = '';
  let declarations = '';
  let entryComponents = [];
  for (const key in demoMap) {
    const otherComponents = retrieveOtherComponents(demoMap[key] && demoMap[key].ts);
    const declareComponents = [`NzDemo${componentName(component)}${componentName(key)}Component`];
    const entries = retrieveEntryComponents(demoMap[key] && demoMap[key].ts);
    entryComponents.push(...entries);
    declareComponents.push(...entries, ...otherComponents);
    // console.log(entries);
    imports += `import { ${declareComponents.join(', ')} } from './${key}';\n`;
    declarations += `\t\t${declareComponents.join(',\n\t')},\n`;
  }
  imports += `import { NzDemo${componentName(component)}ZhComponent } from './zh.component';\n`;
  imports += `import { NzDemo${componentName(component)}EnComponent } from './en.component';\n`;
  declarations += `\t\tNzDemo${componentName(component)}ZhComponent,\n`;
  declarations += `\t\tNzDemo${componentName(component)}EnComponent,\n`;
  if (content.pageDemo) {
    imports += `import { NzPageDemo${componentName(component)}ZhComponent } from './zh.page.component';\n`;
    imports += `import { NzPageDemo${componentName(component)}EnComponent } from './en.page.component';\n`;
    declarations += `\t\tNzPageDemo${componentName(component)}ZhComponent,\n`;
    declarations += `\t\tNzPageDemo${componentName(component)}EnComponent,\n`;
  }
  return demoModuleTemplate
    .replace(/{{imports}}/g, imports)
    .replace(/{{declarations}}/g, declarations)
    .replace(/{{component}}/g, componentName(component))
    .replace(/{{entryComponents}}/g, entryComponents.join(',\n'));
}

function componentName(component) {
  return camelCase(capitalizeFirstLetter(component));
}

function generateComponentName(component, language) {
  return `NzDemo${componentName(component)}${capitalizeFirstLetter(language)}Component`;
}

function generatePageDemoComponent(content) {
  const component = content.name;
  let zhOutput = content.pageDemo.zhCode;
  let enOutput = content.pageDemo.enCode;
  zhOutput = zhOutput
    .replace(`NzPageDemo${componentName(component)}Component`, `NzPageDemo${componentName(component)}ZhComponent`)
    .replace(`nz-page-demo-${component}`, `nz-page-demo-${component}-zh`);
  enOutput = enOutput
    .replace(`NzPageDemo${componentName(component)}Component`, `NzPageDemo${componentName(component)}EnComponent`)
    .replace(`nz-page-demo-${component}`, `nz-page-demo-${component}-en`);
  return {
    en: enOutput,
    zh: zhOutput
  };
}

function generateDemoComponent(content) {
  const demoComponentTemplate = String(fs.readFileSync(path.resolve(__dirname, '../template/demo-component.template.ts')));
  const component = content.name;

  let output = demoComponentTemplate;
  output = output.replace(/{{component}}/g, component);

  let zhOutput = output;
  let enOutput = output;

  enOutput = enOutput.replace(/{{componentName}}/g, generateComponentName(component, 'en'));
  enOutput = enOutput.replace(/{{language}}/g, 'en');
  zhOutput = zhOutput.replace(/{{componentName}}/g, generateComponentName(component, 'zh'));
  zhOutput = zhOutput.replace(/{{language}}/g, 'zh');

  return {
    en: enOutput,
    zh: zhOutput
  };
}

function generateTemplate(result) {
  const generateTitle = require('./generate.title');
  const innerMap = generateExample(result);
  const titleMap = {
    zh: generateTitle(result.docZh.meta, result.docZh.path),
    en: generateTitle(result.docEn.meta, result.docEn.path)
  };
  const name = result.name;
  const hasPageDemo = !!result.pageDemo;
  if (name === 'validator') {
    // console.log(result);
  }
  return {
    zh: wrapperAll(
      generateToc('zh-CN', result.name, result),
      wrapperHeader(titleMap.zh, result.docZh.whenToUse, 'zh', innerMap.zh, hasPageDemo, name) + wrapperAPI(result.docZh.api)
    ),
    en: wrapperAll(
      generateToc('en-US', result.name, result),
      wrapperHeader(titleMap.en, result.docEn.whenToUse, 'en', innerMap.en, hasPageDemo, name) + wrapperAPI(result.docEn.api)
    )
  };
}

function wrapperAPI(content) {
  return `<section class="markdown api-container" ngNonBindable>${content}</section>`;
}

function wrapperHeader(title, whenToUse, language, example, hasPageDemo, name) {
  if (example) {
    return `<section class="markdown">
	${title}
	<section class="markdown" ngNonBindable>
		${whenToUse}
	</section>
	${hasPageDemo ? `<section class="page-demo"><nz-page-demo-${name}-${language}></nz-page-demo-${name}-${language}></section>` : ''}
	<h2>
		<span>${language === 'zh' ? '代码演示' : 'Examples'}</span>
		<i nz-icon nzType="appstore" class="code-box-expand-trigger" nz-tooltip nzTooltipTitle="${
      language === 'zh' ? '展开全部代码' : 'Expand All Code'
    }" (click)="expandAllCode()"></i>
	</h2>
</section>${example}`;
  } else {
    return `<section class="markdown">
	${title}
	<section class="markdown">
		${whenToUse}
	</section></section>`;
  }
}

function wrapperAll(toc, content) {
  return `<article>${toc}${content}</article>`;
}

function generateToc(language, name, result) {
  const demoMap = result.demoMap;
  const languageMap = {
    'zh-CN': 'Zh',
    'en-US': 'En',
  }
  const doc = result[`doc${languageMap[language]}`];
  const {whenToUse} = doc;
  const reg = /id="([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){2,20}"/g;

  const matches = (whenToUse + '').match(reg) || [];
  let linkArray = [];
  if (matches[1]) {
    matches.forEach((value, index) => {
      const id = value.split('=')[1].replace(/"/g, '');

      linkArray.push({
        content: `<nz-link nzHref="#${id}" nzTitle="${id}"></nz-link>`,
        order: 0
      });
    });
  }

  linkArray = linkArray.reverse().map((value, index) => {
    value.order = -(index + 1);
    return value;
  });

  for (const key in demoMap) {
    linkArray.push({
      content: `<nz-link nzHref="#components-${name}-demo-${key}" nzTitle="${demoMap[key].meta.title[language]}"></nz-link>`,
      order: demoMap[key].meta.order
    });
  }
  linkArray.sort((pre, next) => pre.order - next.order);
  linkArray.push({content: `<nz-link nzHref="#api" nzTitle="API"></nz-link>`});
  const links = linkArray.map(link => link.content).join('');
  return `
<nz-affix class="toc-affix" [nzOffsetTop]="16">
    <nz-anchor [nzAffix]="false" nzShowInkInFixed (nzClick)="goLink($event)">
        ${links}
    </nz-anchor>
</nz-affix>`;
}

function generateExample(result) {
  const demoMap = result.demoMap;
  const isZhUnion = result.docZh.meta.cols;
  const isEnUnion = result.docEn.meta.cols;
  const templateSplit = String(fs.readFileSync(path.resolve(__dirname, '../template/example-split.template.html')));
  const templateUnion = String(fs.readFileSync(path.resolve(__dirname, '../template/example-union.template.html')));
  let demoList = [];
  for (const key in demoMap) {
    demoList.push(Object.assign({name: key}, demoMap[key]));
  }
  demoList.sort((pre, next) => pre.meta.order - next.meta.order);
  let firstZhPart = '';
  let secondZhPart = '';
  let firstEnPart = '';
  let secondEnPart = '';
  let enPart = '';
  let zhPart = '';
  demoList.forEach((item, index) => {
    enPart += item.enCode;
    zhPart += item.zhCode;
    if (index % 2 === 0) {
      firstZhPart += item.zhCode;
      firstEnPart += item.enCode;
    } else {
      secondZhPart += item.zhCode;
      secondEnPart += item.enCode;
    }
  });
  return {
    zh: isZhUnion
      ? templateUnion.replace(/{{content}}/g, zhPart)
      : templateSplit.replace(/{{first}}/g, firstZhPart).replace(/{{second}}/g, secondZhPart),
    en: isEnUnion
      ? templateUnion.replace(/{{content}}/g, enPart)
      : templateSplit.replace(/{{first}}/g, firstEnPart).replace(/{{second}}/g, secondEnPart)
  };
}

function retrieveEntryComponents(plainCode) {
  const matches = (plainCode + '').match(/^\/\*\s*?declarations:\s*([^\n]+?)\*\//) || [];
  if (matches[1]) {
    return matches[1]
      .split(',')
      .map(className => className.trim())
      .filter((value, index, self) => value && self.indexOf(value) === index);
  }
  return [];
}

function retrieveOtherComponents(plainCode) {
  const componentReg = /export\s+class\s+[A-Z][A-Za-z0-9]*Other[A-Za-z0-9]?Component/g;

  const matches = (plainCode + '').match(componentReg) || [];

  if (matches[0]) {
    return matches.map(value => {
      value.replace(/export\s+class\s+/, '');
      return value.replace(/export\s+class\s+/, '');
    });
  }
  return [];
}

