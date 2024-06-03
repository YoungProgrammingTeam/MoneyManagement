from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.mixins import UpdateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import api_view, authentication_classes, permission_classes

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

from money_management.users.models import User, Expense, Transaction, ExpenseAnalytics
from django.http import Http404
from .serializers import UserSerializer
from .list_stocks_tickers import stocks_data
from .list_coins_tickers import coins_data
import requests




class UserViewSet(RetrieveModelMixin, ListModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "pk"

    def get_queryset(self, *args, **kwargs):
        assert isinstance(self.request.user.id, int)
        return self.queryset.filter(id=self.request.user.id)

    @action(detail=False)
    def me(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)
    

@api_view(['GET'])
def get_data(request):
    user = request.user

    # Пример данных
    total_amount = {'value': 10000, 'change': '+20%'}
    apple_stock = {'value': 346, 'change': '+33%'}
    btc_price = {'value': 61524, 'change': '-8%'}

    top_expenses = Expense.objects.filter(user=user).values('category', 'amount')
    transactions = Transaction.objects.filter(user=user).values('category', 'balance', 'amount', 'percentage')
    expense_analytics = ExpenseAnalytics.objects.filter(user=user).values('month', 'amount')

    data = {
        'totalAmount': total_amount,
        'appleStock': apple_stock,
        'btcPrice': btc_price,
        'topExpenses': list(top_expenses),
        'transactions': list(transactions),
        'expenseAnalytics': list(expense_analytics),
    }
    return Response(data)


@api_view(['GET'])
def get_data_for_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise Http404("User not found")

    # Пример данных
    total_amount = {'value': 10000, 'change': '+20%'}
    apple_stock = {'value': 346, 'change': '+33%'}
    btc_price = {'value': 61524, 'change': '-8%'}

    top_expenses = Expense.objects.filter(user=user).values('category', 'amount')
    transactions = Transaction.objects.filter(user=user).values('category', 'balance', 'amount', 'percentage')
    expense_analytics = ExpenseAnalytics.objects.filter(user=user).values('month', 'amount')

    data = {
        'totalAmount': total_amount,
        'appleStock': apple_stock,
        'btcPrice': btc_price,
        'topExpenses': list(top_expenses),
        'transactions': list(transactions),
        'expenseAnalytics': list(expense_analytics),
    }
    return Response(data)


@api_view(['GET'])
def get_crypto_currency(request, symbol):
    try:
        url = f'https://www.binance.com/api/v3/ticker/price?symbol={symbol.upper()}'
        response = requests.get(url).json() 
        return Response(response)
    except Exception as e:
        return Response(e)


@api_view(['GET'])
def get_stock_currency(request, symbol):
    try:
        url = f"https://api.polygon.io/v2/aggs/ticker/{symbol.upper()}/prev?adjusted=true&apiKey=EH2vpdYrp_dt3NHfcTjPhu0JOKKw0Lwz"
        response = requests.get(url).json()
        data = {
            'symbol': symbol.upper(),
            'price': response['results'][0]['o']
        }
        return Response(data)
    except Exception as e:
        raise Http404("Symbol invalid")


@api_view(['GET'])
def get_stock_list(request):
    try:
        return Response(stocks_data)
    except Exception as e:
        raise Http404(e)


@api_view(['GET'])
def get_crypto_currency_list(request):
    try:
        return Response(coins_data)
    except Exception as e:
        raise Http404(e)
    
    