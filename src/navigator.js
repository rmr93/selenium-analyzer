const { By, until } = require('selenium-webdriver')
const files = require('./files')

const login = async (driver) => {
  await driver.get('https://app.fieldcontrol.com.br')
  // await driver.findElement(By.name('email')).sendKeys()
  // await driver.findElement(By.name('password')).sendKeys()
  await driver.findElement(By.className('submit-button')).click()
  await driver.wait(until.urlContains('atividades'), 10000, 'Não foi possível logar')
  await driver.wait(until.elementIsEnabled(driver.findElement(By.className('md-cancel-button'))))
  await driver.findElement(By.className('md-cancel-button')).click()
  await driver.wait(until.elementLocated(By.css('md-progress-circular')))
}

const to = (driver, relativePath, collapsedMenuParents = [ 1 ]) => {
  return new Promise((resolve, reject) => {
    driver.findElement(By.xpath(`//a[@href="#/${relativePath}"]`)).then((element) => {
      element.click().catch(async () => {
        let xpath = '//*[@id="vertical-navigation"]/ms-navigation'

        for (let index of collapsedMenuParents) {
          xpath = xpath.concat(`/ul/li[${index}]`)
          await driver.wait(until.elementLocated(By.xpath(xpath)))
          await driver.findElement(By.xpath(xpath)).click()
        }
      }).finally(() => {
        driver.wait(until.urlContains(relativePath), 1000).catch(async () => {
          await driver.get(`https://app.fieldcontrol.com.br/#/${relativePath}`)
        }).finally(async () => {
          driver.wait(until.elementLocated(By.css('md-progress-circular')), 2000)
            .then(async () => {
              const loader = await driver.findElement(By.css('md-progress-circular'))

              driver.wait(until.stalenessOf(loader)).catch(err => {
                files.log.write(err)
              }).finally(async () => {
                await driver.sleep(1000)
                return resolve()
              })
            })
            .catch(async (err) => {
              files.log.write(err)
            }).finally(async () => {
              await driver.sleep(1500)
              return resolve()
            })
        })
      })
    })
  })
}

const tour = async (driver) => {
  await to(driver, 'painel-de-controle/listagem')
  await to(driver, 'tipos-de-atividade')
  await to(driver, 'painel-de-controle/linha-do-tempo')
  await to(driver, 'painel-de-controle/mapa')
  await to(driver, 'calendario-de-atividades')
  await to(driver, 'atividades-recorrentes')
  await to(driver, 'chamados-e-oportunidades')
  await to(driver, 'clientes')
  await to(driver, 'colaboradores', [ 3 ])
  await to(driver, 'ausencias', [ 3 ])
  await to(driver, 'historico-de-rotas', [ 3 ])
  await to(driver, 'equipamentos', [ 4 ])
  await to(driver, 'tipos-de-equipamento', [ 4 ])
  await to(driver, 'formularios')
  await to(driver, 'materiais')
  await to(driver, 'usuarios', [ 8, 1 ])
  await to(driver, 'dispositivos', [ 8, 1 ])
  await to(driver, 'configuracoes/dados-da-empresa', [ 8, 1 ])
  await to(driver, 'configuracoes/gerenciar-etiquetas', [ 8, 1 ])
  await to(driver, 'configuracoes/integracoes', [ 8, 1 ])
  await to(driver, 'modulos', [ 8, 2 ])
  await to(driver, 'configuracoes/ordens-de-servico', [ 8, 2 ])
  await to(driver, 'configuracoes/linha-do-tempo', [ 8, 2 ])
  await to(driver, 'configuracoes/aplicativo-do-celular', [ 8, 2 ])
  await to(driver, 'configuracoes/outras', [ 8, 2 ])
  await to(driver, 'configuracoes/configuracao-para-desenvolvedores', [ 8, 3 ])
  await to(driver, 'configuracoes/historico-eventos-de-integracao', [ 8, 3 ])
}

const openTask = async (driver) => {
  await navigator.to(driver, 'atividades', [ 1 ])
  await driver.findElement('')
}

module.exports = {
  to,
  tour,
  login,
  openTask
}
