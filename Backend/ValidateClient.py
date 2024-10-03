class ValidateClient:
    
    def __init__(self, name, last_name, email, cellphone):
        self.error_name = self.validate(name, 'nombre')
        self.error_last_name = self.validate(last_name, 'apellido')
        self.error_email = self.validate(email, 'email')
        self.error_cellphone = self.validate(cellphone, 'telefono')
        
    def validate(self, val, field):
        if len(val) < 4:
            return f'El campo {field} es muy corto'
        return ''
        
    def get_errors(self):
        if(self.error_name != '' or self.error_last_name != '' or self.error_email != '' or self.error_cellphone):
            return [
                self.error_name,
                self.error_last_name,
                self.error_email,
                self.error_cellphone,
            ]
        else:
            return []