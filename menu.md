openapi: 3.0.0
info:
  title: Menu API
  version: 1.0.0
  description: API for managing menu items in a cafe payment system
paths:
  /menu:
    get:
      summary: Get all menu items
      responses:
        '200':
          description: A list of menu items
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Menu'
    post:
      summary: Create a new menu item
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateMenuDto'
      responses:
        '201':
          description: The created menu item
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Menu'
  /menu/{id}:
    get:
      summary: Get a menu item by ID
      parameters:
        - in: path
          name: id
          schema:
            type: string
          required: true
          description: The ID of the menu item
      responses:
        '200':
          description: A menu item
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Menu'
        '404':
          description: Menu item not found
    put:
      summary: Update a menu item by ID
      parameters:
        - in: path
          name: id
          schema:
            type: string
          required: true
          description: The ID of the menu item
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateMenuDto'
      responses:
        '200':
          description: The updated menu item
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Menu'
        '404':
          description: Menu item not found
    delete:
      summary: Delete a menu item by ID
      parameters:
        - in: path
          name: id
          schema:
            type: string
          required: true
          description: The ID of the menu item
      responses:
        '204':
          description: Menu item deleted
        '404':
          description: Menu item not found
components:
  schemas:
    Menu:
      type: object
      properties:
        id:
          type: string
        namaMenu:
          type: string
        stokMenu:
          type: integer
        kategoriMenu:
          type: string
        hargaMenu:
          type: string
    CreateMenuDto:
      type: object
      properties:
        namaMenu:
          type: string
        stokMenu:
          type: integer
        kategoriMenu:
          type: string
        hargaMenu:
          type: string