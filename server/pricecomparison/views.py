from django.shortcuts import render,redirect,HttpResponse

import requests
from bs4 import BeautifulSoup
import json
from selenium import webdriver
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

from django.contrib.auth.models import User

from smtplib import SMTP

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from django.contrib.auth import authenticate 
from django.contrib.auth.forms import AuthenticationForm

class NewUserForm(UserCreationForm):
	email = forms.EmailField(required=True)

	class Meta:
		model = User
		fields = ("username", "email", "password1", "password2")

	def save(self, commit=True):
		user = super(NewUserForm, self).save(commit=False)
		user.email = self.cleaned_data['email']
		if commit:
			user.save()
		return user

@csrf_exempt 
def signup(request):
    form = NewUserForm(request.POST)
    if form.is_valid():
      user = form.save()
      return HttpResponse("success")
    return HttpResponse("fail")

@csrf_exempt
def login(request):
  form = AuthenticationForm(request, data=request.POST)
  if form.is_valid():
    username = form.cleaned_data.get('username')
    password = form.cleaned_data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
      return HttpResponse("loggedin")
    else:
      return HttpResponse("Invalid username or password.")
  else:
    return HttpResponse("Invalid username or password.")

@csrf_exempt
def email(request):
    sender = 'ecpcspm@gmail.com'
    username = request.POST.get('username')
    u = User.objects.get(username=username)
    print(u.email)
    to = u.email
    name = request.POST.get('name')
    priceA = request.POST.get('priceA')
    priceF = request.POST.get('priceF')
    priceC = request.POST.get('priceC')
    linkA = request.POST.get('linkA')
    linkF = request.POST.get('linkF')
    linkC = request.POST.get('linkC')
    server = SMTP('smtp.gmail.com',587)
    server.ehlo()
    server.starttls()
    server.ehlo()
    server.login('ecpcspm@gmail.com','123456@Dd')
    
    subject = 'Alert! Prices have dropped!'
    body = f'Your product is: {name} \n\n Amazon link is: {linkA} \n Amazon price is: {priceA} \n\n Flipkart link is: {linkF} \n Flipkart price is: {priceF} \n\n Croma link is: {linkC} \n Croma price is: {priceC}'

    msg = f'subject: {subject} \n\n {body}'
    sender=sender
    to = to
    print(msg)
    server.sendmail(sender,to,msg)
    server.quit()

    return HttpResponse('Mail sent successfully!')
   


@csrf_exempt 
def index(request): 
    print(request.POST.get('product_name'))
    Pname = request.POST.get('product_name')
    # print('-----------searching in amazon-----------')
    product_name = Pname.replace(" ","+")
    amazon_string = f'https://www.amazon.in/s?k={product_name}'
    headers = {"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"}
    r = requests.get(amazon_string,headers=headers)
    soup = BeautifulSoup(r.content,'html.parser')
    results = soup.find_all('div',{'data-component-type':'s-search-result'})
    # print(len(results))
    price_list = []
    url = []
    detail = []
    description_list = []
    image_url = []
    for item in results:
      try:
        image_object = item.find('img')
        image = image_object.get('src')
        image_url.append(image)
        atag = item.h2.a
        description = atag.text.strip()
        description_list.append(description)
        redirection_URL = 'https://www.amazon.in' + atag.get('href')
        url.append(redirection_URL)
        price_parent_class = item.find('span','a-price')
        amazon_price = price_parent_class.find('span','a-offscreen').text
        price = int(''.join(filter(lambda i: i.isdigit(), amazon_price)))
        price_list.append(price)
        break
      except:
        continue
    min_price = min(price_list)
    amazonP=min_price
    linkA=url[price_list.index(min_price)]
    imag_url= image_url[price_list.index(min_price)]

  # flipkart
    flipkart_string = f'https://www.flipkart.com/search?q={product_name}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off'
    r = requests.get(flipkart_string,headers=headers)
    soup = BeautifulSoup(r.content,'html.parser')
    results = soup.find_all('div',{'class':'_1AtVbE col-12-12'})
    #print('total results: ',len(results))
    price_list = []
    url = []
    description_list = []
    for item in results:
      try:
        atag = item.a
        div_des = atag.find('div',{'class':'_4rR01T'})
        description = div_des.text.strip()
        description_list.append(description)
        detail_li = atag.find_all('li',{'class':'rgWa7D'})
        for li in detail_li:
          detail.append(li.text.strip())
        redirection_URL = 'https://www.flipkart.com'+ atag.get('href')
        url.append(redirection_URL)
        flipkart_price = atag.find('div',{'class':'_30jeq3 _1_WHN1'}).text
        price = int(''.join(filter(lambda i: i.isdigit(), flipkart_price)))
        price_list.append(price)
        break
      except:
        continue    
    min_price = min(price_list)
    flipkartP=min_price
    linkF= url[price_list.index(min_price)]
    des=description_list[price_list.index(min_price)]

    #Croma
    # print('-----------searching in croma-----------')
    croma_string = f'https://croma.com/search/?text={product_name}'
    wd = webdriver.Chrome('Z:\IT414_SPM\project\epcs\server\pricecomparison\chromedriver.exe',options=chrome_options)
    wd.get(croma_string)
    soup = BeautifulSoup(wd.page_source,'html.parser')
    results = soup.find('ul',{'data-testid':'product-list'})
    price_list = []
    url = []
    description_list = []
    #image_url = []
    for item in results:
      try:
        atag = item.h3.a
        description = atag.text.strip()
        description_list.append(description)
        redirection_URL = 'https://www.croma.com' + atag.get('href')
        url.append(redirection_URL)
        croma_price = item.find('span',{'data-testid':'price'}).text
        price = (int(''.join(filter(lambda i: i.isdigit(), croma_price))))/100
        price_list.append(price)
        print(price_list)
        break
      except:
        continue
    min_price = min(price_list)
    cromaP=min_price
    linkC=url[price_list.index(min_price)]

    wd.quit()
    fm={
      'pname':Pname,
      'des':des,
      'imagurl':imag_url,
      'linkA':linkA,
      'linkF':linkF,
      'priceA':amazonP,
      'priceF':flipkartP,
      'linkC':linkC,
      'priceC':cromaP,
      'detail':detail
    }
    return HttpResponse(json.dumps(fm))

@csrf_exempt 
def populer(request): 
    List = []
    amazon_string = f'https://www.flipkart.com/offers-store?otracker=nmenu_offer-zone'
    wd = webdriver.Chrome('Z:\IT414_SPM\project\epcs\server\pricecomparison\chromedriver.exe',options=chrome_options)
    wd.get(amazon_string)
    soup = BeautifulSoup(wd.page_source,'html.parser')
    results = soup.find_all('div',{'class':'_3YgSsQ'})
    url = []
    image_url = []
    name = []
    price = []
    des = []
    for item in results:
      try:
        image_object = item.find('img')
        image = image_object.get('src')
        image_url.append(image)
        atag = item.div.a
        redirection_URL = 'https://www.flipkart.com' + atag.get('href')
        url.append(redirection_URL)
        pname = item.find('div',{'class':'_3LU4EM'}).text
        name.append(pname)
        pprice = item.find('div',{'class':'_2tDhp2'}).text
        price.append(pprice)
        pdes = item.find('div',{'class':'ZOGard'}).text
        des.append(pdes)
      except:
        continue
    for iterator in range(len(url)):
      try:
        List.append({
          'link': url[iterator],
          'name':name[iterator],
          'imag_url':image_url[iterator],
          'price':price[iterator],
          'des':des[iterator]
        })
      except:
        continue
    wd.quit()

    return HttpResponse(json.dumps(List))

@csrf_exempt
def product(request,product):
    List = []
    amazon_string = f'https://www.amazon.in/s?k={product}'
    print(amazon_string)
    headers = {"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"}
    r = requests.get(amazon_string,headers=headers)
    soup = BeautifulSoup(r.content,'html.parser')
    results = soup.find_all('div',{'data-component-type':'s-search-result'})
    price_list = []
    url = []
    description_list = []
    image_url = []
    for item in results:
      try:
        image_object = item.find('img')
        image = image_object.get('src')
        image_url.append(image)
        atag = item.h2.a
        description = atag.text.strip()
        description_list.append(description)
        redirection_URL = 'https://www.amazon.in' + atag.get('href')
        url.append(redirection_URL)
        price_parent_class = item.find('span','a-price')
        amazon_price = price_parent_class.find('span','a-offscreen').text
        price = int(''.join(filter(lambda i: i.isdigit(), amazon_price)))
        price_list.append(price)
      except:
        continue
    for iterator in range(len(url)):
      try:
        List.append({
          'link': url[iterator],
          'imag_url': image_url[iterator],
          'price': price_list[iterator],
          'des': description_list[iterator]
        })
      except:
        continue

    return HttpResponse(json.dumps(List))